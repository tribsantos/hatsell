import { useState, useEffect, useRef } from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import { MOTION_TYPES, MOTION_STATUS, MOTION_CATEGORY, VOTE_THRESHOLDS } from '../constants/motionTypes';
import * as MeetingConnection from '../services/MeetingConnection';
import { createMotionEntry, pushMotion, popMotion, getCurrentPendingQuestion, getMainMotion, determineVoteResult, updateTopMotion, updateMotionById } from '../engine/motionStack';
import { getRules, getDisplayName } from '../engine/motionRules';
import { createRequest, acceptRequest, respondToRequest, dismissRequest, cleanupRequests } from '../engine/pendingRequests';
import { isDebateAllowed } from '../engine/debateEngine';
import { handleDivision } from '../engine/voteEngine';
import { resolveQuorum, formatQuorumRule } from '../engine/quorum';

const INITIAL_MEETING_STATE = {
    stage: MEETING_STAGES.NOT_STARTED,
    participants: [],
    motionStack: [],
    pendingRequests: [],
    savedSpeakingState: {},
    suspendedSpeakingState: null,
    tabledMotions: [],
    decidedMotions: [],
    speakingQueue: [],
    speakingHistory: [],
    currentSpeaker: null,
    votes: { aye: 0, nay: 0, abstain: 0 },
    votedBy: [],
    voteDetails: [],
    log: [],
    quorum: 0,
    quorumRule: null,
    rollCallStatus: {},
    pendingAmendments: [],
    pendingMotions: [],
    minutesCorrections: [],
    notifications: [],
    lastChairRuling: null,
    lastActivityTime: null,

    // Legacy compat - kept for minutes correction flow
    currentMotion: null
};

export function useMeetingState() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [meetingState, setMeetingStateRaw] = useState(INITIAL_MEETING_STATE);
    const meetingStateRef = useRef(meetingState);
    meetingStateRef.current = meetingState;

    // Wrapper that updates ref immediately so heartbeat/subscribe don't read stale state
    const setMeetingState = (newState) => {
        meetingStateRef.current = newState;
        setMeetingStateRaw(newState);
    };
    const hasAttemptedReconnect = useRef(false);
    const pendingRecognitionLock = useRef(false);

    // === SESSION PERSISTENCE: auto-reconnect on mount ===
    useEffect(() => {
        if (hasAttemptedReconnect.current) return;
        hasAttemptedReconnect.current = true;

        try {
            const saved = sessionStorage.getItem('hatsell_session');
            if (!saved) return;
            const session = JSON.parse(saved);
            if (!session.name || !session.role || !session.meetingCode) return;

            // Reconnect
            MeetingConnection.connect(session.meetingCode);
            MeetingConnection.getState().then(existingState => {
                if (existingState && existingState.stage !== MEETING_STAGES.ADJOURNED) {
                    const migratedState = migrateState(existingState);
                    setCurrentUser({ name: session.name, role: session.role, meetingCode: session.meetingCode });
                    setIsLoggedIn(true);
                    setMeetingState(migratedState);
                } else {
                    sessionStorage.removeItem('hatsell_session');
                    MeetingConnection.disconnect();
                }
            });
        } catch {
            sessionStorage.removeItem('hatsell_session');
        }
    }, []);

    const addToLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = [...meetingState.log, { timestamp, message }];
        return newLog;
    };

    const MAX_LOG_ENTRIES = 200;

    const updateMeetingState = (updates) => {
        const newState = { ...meetingStateRef.current, ...updates };
        // Cap log to prevent unbounded growth
        if (newState.log && newState.log.length > MAX_LOG_ENTRIES) {
            newState.log = newState.log.slice(-MAX_LOG_ENTRIES);
        }
        // Keep voteDetails in sync with votedBy resets
        if (updates.votedBy && updates.votedBy.length === 0 && !('voteDetails' in updates)) {
            newState.voteDetails = [];
        }
        newState.lastActivityTime = Date.now();
        meetingStateRef.current = newState;
        setMeetingState(newState);
        MeetingConnection.broadcast(newState);
    };

    // ========== LOGIN / MEETING SETUP ==========

    const handleLogin = async (userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);

        // Persist session for reconnection on refresh
        sessionStorage.setItem('hatsell_session', JSON.stringify({
            name: userData.name,
            role: userData.role,
            meetingCode: userData.meetingCode
        }));

        MeetingConnection.connect(userData.meetingCode);
        const existingState = await MeetingConnection.getState();

        if (userData.role === ROLES.PRESIDENT) {
            if (existingState && existingState.stage !== MEETING_STAGES.ADJOURNED) {
                const hasActivePresident = existingState.participants.some(p => {
                    if (p.role !== ROLES.PRESIDENT) return false;
                    if (!p.lastSeen) return true;
                    return (Date.now() - p.lastSeen) < 10000;
                });

                if (hasActivePresident) {
                    alert('A meeting is already in progress with an active Chair. Please join as a participant or wait for it to end.');
                    MeetingConnection.disconnect();
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    return;
                }
            }

            const userWithTimestamp = { ...userData, lastSeen: Date.now() };

            // Convert orgProfile quorum settings to quorumRule format
            let quorumRule = null;
            let quorum = 0;
            if (userData.orgProfile) {
                const op = userData.orgProfile;
                if (op.quorumType === 'fixed' && op.quorumValue) {
                    quorumRule = { type: 'number', value: parseInt(op.quorumValue) };
                    quorum = parseInt(op.quorumValue);
                } else if (op.quorumType === 'fraction' && op.quorumValue) {
                    quorumRule = { type: 'fraction', value: parseFloat(op.quorumValue) };
                    quorum = Math.ceil(parseFloat(op.quorumValue) * (parseInt(op.totalMembership) || 1));
                } else if (op.quorumType === 'default') {
                    const membership = parseInt(op.totalMembership);
                    if (membership) {
                        quorumRule = { type: 'fraction', value: 'majority' };
                        quorum = Math.floor(membership / 2) + 1;
                    } else {
                        // No total membership known — majority of those present
                        quorumRule = { type: 'majority_present' };
                        quorum = 1; // Will be recalculated at roll call
                    }
                }
            }

            const initialState = {
                ...INITIAL_MEETING_STATE,
                stage: MEETING_STAGES.CALL_TO_ORDER,
                participants: [userWithTimestamp],
                log: [{
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Meeting created by ${userData.name}`
                }],
                meetingCode: userData.meetingCode,
                orgProfile: userData.orgProfile || null,
                meetingSettings: userData.meetingSettings || null,
                quorumRule,
                quorum
            };
            setMeetingState(initialState);
            await MeetingConnection.broadcast(initialState);
        } else {
            if (!existingState) {
                alert('No active meeting found. Please wait for the Chair to start the meeting.');
                MeetingConnection.disconnect();
                setIsLoggedIn(false);
                setCurrentUser(null);
                return;
            }

            // Migrate old state format if needed
            const migratedState = migrateState(existingState);

            const existingParticipant = migratedState.participants.find(p => p.name === userData.name);

            if (existingParticipant) {
                // If the existing participant is still active (seen within 10s), this is a duplicate name
                const isActive = existingParticipant.lastSeen && (Date.now() - existingParticipant.lastSeen) < 10000;
                if (isActive && existingParticipant.role !== userData.role) {
                    alert(`The name "${userData.name}" is already in use by an active participant. Please choose a different name.`);
                    MeetingConnection.disconnect();
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    return;
                }
                // Otherwise it's a reconnect — restore state
                setMeetingState(migratedState);
            } else {
                const userWithTimestamp = { ...userData, lastSeen: Date.now() };
                const updatedParticipants = [...migratedState.participants, userWithTimestamp];
                const newLog = [...migratedState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `${userData.name} joined as ${userData.role}`
                }];

                const newState = {
                    ...migratedState,
                    participants: updatedParticipants,
                    log: newLog
                };
                setMeetingState(newState);
                await MeetingConnection.broadcast(newState);
            }
        }
    };

    // ========== MEETING LIFECYCLE ==========

    const handleCallToOrder = () => {
        updateMeetingState({
            stage: MEETING_STAGES.ROLL_CALL,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Meeting called to order'
            }]
        });
    };

    const handleSetQuorum = (rule) => {
        const resolved = resolveQuorum(rule, meetingState.participants.length);
        updateMeetingState({
            quorumRule: rule,
            quorum: resolved,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Quorum set to ${formatQuorumRule(rule)} (${resolved} members required).`
            }]
        });
    };

    const handleRollCall = () => {
        const officers = meetingState.participants.filter(p =>
            p.role === ROLES.PRESIDENT ||
            p.role === ROLES.VICE_PRESIDENT ||
            p.role === ROLES.SECRETARY
        ).length;

        const responded = Object.keys(meetingState.rollCallStatus || {}).filter(key =>
            meetingState.rollCallStatus[key] === 'present'
        ).length;

        const totalPresent = officers + responded;
        const totalMembers = meetingState.participants.length;

        // Resolve quorum from rule if set, otherwise use total participant count
        const quorumRule = meetingState.quorumRule;
        const quorum = quorumRule
            ? resolveQuorum(quorumRule, totalMembers)
            : totalMembers;

        const quorumMet = totalPresent >= quorum;
        const quorumMsg = quorumRule
            ? `Roll call complete. ${totalPresent} of ${totalMembers} members present. Quorum requirement: ${quorum}. ${quorumMet ? 'Quorum established.' : 'QUORUM NOT MET.'}`
            : `Roll call complete. ${totalPresent} of ${totalMembers} members present. Quorum established.`;

        if (!quorumMet && quorumRule) {
            updateMeetingState({
                quorum,
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: quorumMsg
                }, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: 'Meeting cannot proceed without a quorum. Meeting adjourned.'
                }],
                stage: MEETING_STAGES.ADJOURNED
            });
            return;
        }

        updateMeetingState({
            stage: MEETING_STAGES.APPROVE_MINUTES,
            quorum,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: quorumMsg
            }]
        });
    };

    const handleCallMember = (memberName) => {
        updateMeetingState({
            rollCallStatus: {
                ...meetingState.rollCallStatus,
                [memberName]: 'called'
            },
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${memberName} called for roll.`
            }]
        });
    };

    const handleRespondToRollCall = () => {
        updateMeetingState({
            rollCallStatus: {
                ...meetingState.rollCallStatus,
                [currentUser.name]: 'present'
            },
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name}: Present.`
            }]
        });
    };

    const handleMarkPresent = (memberName) => {
        updateMeetingState({
            rollCallStatus: {
                ...meetingState.rollCallStatus,
                [memberName]: 'present'
            },
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${memberName}: Present (confirmed by ${currentUser.name}).`
            }]
        });
    };

    const handleApproveMinutes = () => {
        updateMeetingState({
            stage: MEETING_STAGES.NEW_BUSINESS,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Minutes approved. Proceeding to New Business.'
            }]
        });
    };

    // ========== MOTION STACK OPERATIONS ==========

    const handleNewMotion = (motionText, mover) => {
        const entry = createMotionEntry(MOTION_TYPES.MAIN, motionText, mover);
        if (entry.error) {
            console.error(entry.error);
            return;
        }

        const { newStack, error } = pushMotion(meetingState.motionStack, entry);
        if (error) {
            updateMeetingState({
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Motion not in order: ${error}`
                }]
            });
            return;
        }

        updateMeetingState({
            motionStack: newStack,
            currentMotion: { text: motionText, mover, needsSecond: true },
            stage: MEETING_STAGES.NEW_BUSINESS,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${mover} moved: "${motionText}"`
            }]
        });
    };

    const handleChairAcceptMotion = () => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top || top.status !== MOTION_STATUS.PENDING_CHAIR) return;

        const newStack = updateTopMotion(meetingState.motionStack, {
            status: MOTION_STATUS.PENDING_SECOND
        });

        updateMeetingState({
            motionStack: newStack,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The chair recognizes the motion: "${top.displayName}". Is there a second?`
            }]
        });
    };

    const handleChairRejectMotion = () => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top || top.status !== MOTION_STATUS.PENDING_CHAIR) return;

        const { newStack } = popMotion(meetingState.motionStack);

        // Restore speaking state if returning to a motion below
        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        let restoredSpeaking = { speakingQueue: [], speakingHistory: [], currentSpeaker: null };
        const below = getCurrentPendingQuestion(newStack);
        if (below && savedSpeakingState[below.id]) {
            restoredSpeaking = savedSpeakingState[below.id];
            delete savedSpeakingState[below.id];
        }

        updateMeetingState({
            motionStack: newStack,
            stage: newStack.length > 0 ? MEETING_STAGES.MOTION_DISCUSSION : MEETING_STAGES.NEW_BUSINESS,
            currentMotion: below ? {
                text: below.text,
                mover: below.mover,
                seconder: below.seconder,
                needsSecond: false
            } : null,
            ...restoredSpeaking,
            savedSpeakingState,
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: [],
            lastChairRuling: {
                type: 'ruled_out_of_order',
                ruling: 'out_of_order',
                concern: top.text,
                raisedBy: top.mover,
                timestamp: Date.now()
            },
            chairDecisionTime: Date.now(),
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The chair rules the motion "${top.text}" out of order.`
            }]
        });
    };

    const handleSecondMotion = () => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top || top.status !== MOTION_STATUS.PENDING_SECOND) return;

        // Chair can confirm an oral second even if they are the mover
        const isChairUser = currentUser.role === ROLES.PRESIDENT || currentUser.role === ROLES.VICE_PRESIDENT;
        if (currentUser.name === top.mover && !isChairUser) return;

        const isOralConfirm = isChairUser && currentUser.name === top.mover;
        const logMessage = isOralConfirm
            ? `The chair confirmed a second for: ${top.displayName}.${top.isDebatable ? ' Floor is open for discussion.' : ' Proceeding to vote (not debatable).'}`
            : `${top.displayName} seconded by ${currentUser.name}.${top.isDebatable ? ' Floor is open for discussion.' : ' Proceeding to vote (not debatable).'}`;

        const newStack = updateTopMotion(meetingState.motionStack, {
            seconder: isOralConfirm ? '(oral second)' : currentUser.name,
            status: MOTION_STATUS.DEBATING
        });

        const updatedTop = getCurrentPendingQuestion(newStack);

        const updates = {
            motionStack: newStack,
            currentMotion: {
                text: updatedTop.text,
                mover: updatedTop.mover,
                seconder: updatedTop.seconder,
                needsSecond: false
            },
            stage: updatedTop.isDebatable ? MEETING_STAGES.MOTION_DISCUSSION : MEETING_STAGES.VOTING,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: logMessage
            }]
        };
        if (!updatedTop.isDebatable) {
            updates.voteStartTime = Date.now();
        }
        updateMeetingState(updates);
    };

    const handleDeclareNoSecond = () => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top || top.status !== MOTION_STATUS.PENDING_SECOND) return;

        const { newStack } = popMotion(meetingState.motionStack);

        // Restore speaking state if returning to a motion below
        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        let restoredSpeaking = { speakingQueue: [], speakingHistory: [], currentSpeaker: null };
        const below = getCurrentPendingQuestion(newStack);
        if (below && savedSpeakingState[below.id]) {
            restoredSpeaking = savedSpeakingState[below.id];
            delete savedSpeakingState[below.id];
        }

        updateMeetingState({
            motionStack: newStack,
            stage: newStack.length > 0 ? MEETING_STAGES.MOTION_DISCUSSION : MEETING_STAGES.NEW_BUSINESS,
            currentMotion: below ? {
                text: below.text,
                mover: below.mover,
                seconder: below.seconder,
                needsSecond: false
            } : null,
            ...restoredSpeaking,
            savedSpeakingState,
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: [],
            lastChairRuling: {
                type: 'no_second',
                ruling: 'no_second',
                concern: top.text,
                raisedBy: top.mover,
                timestamp: Date.now()
            },
            chairDecisionTime: Date.now(),
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The motion "${top.text}" falls for lack of a second.`
            }]
        });
    };

    const handleMoveSubsidiary = (motionType, text, metadata = {}) => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top) return;

        const rules = getRules(motionType);
        if (!rules) return;

        // For amendments, determine degree
        if (motionType === MOTION_TYPES.AMEND) {
            const currentDegree = top.motionType === MOTION_TYPES.AMEND ? top.degree : 0;
            metadata.degree = currentDegree + 1;
            metadata.appliedTo = top.id;
        }

        // If someone is speaking and this is a non-interrupting motion, queue it
        if (meetingState.currentSpeaker && !rules.canInterrupt) {
            // Enforce precedence: block if a pending motion already has >= precedence
            const pendingList = meetingState.pendingMotions || [];
            if (pendingList.length > 0 && rules.precedence !== null) {
                const highestPendingPrec = pendingList.reduce((max, pm) => {
                    const pmRules = getRules(pm.motionType);
                    return pmRules && pmRules.precedence !== null && pmRules.precedence > max ? pmRules.precedence : max;
                }, 0);
                if (rules.precedence <= highestPendingPrec) {
                    updateMeetingState({
                        log: [...meetingState.log, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `${rules.displayName} is out of order: a higher or equal priority motion is already pending.`
                        }]
                    });
                    return;
                }
            }

            const pending = {
                motionType,
                text,
                metadata,
                proposer: currentUser.name,
                displayName: rules.displayName,
                timestamp: Date.now()
            };
            updateMeetingState({
                pendingMotions: [...(meetingState.pendingMotions || []), pending],
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `${currentUser.name} proposes: ${rules.displayName} - "${text}" (queued — speaker has the floor)`
                }]
            });
            return;
        }

        const entry = createMotionEntry(motionType, text, currentUser.name, metadata);
        if (entry.error) {
            console.error(entry.error);
            return;
        }

        const { newStack, error } = pushMotion(meetingState.motionStack, entry);
        if (error) {
            console.error(error);
            return;
        }

        // Save speaking state for the current motion before pushing
        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        savedSpeakingState[top.id] = {
            speakingQueue: meetingState.speakingQueue || [],
            speakingHistory: meetingState.speakingHistory || [],
            currentSpeaker: meetingState.currentSpeaker || null
        };

        const updates = {
            motionStack: newStack,
            savedSpeakingState,
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            pendingAmendments: meetingState.pendingAmendments,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} moves: ${rules.displayName} - "${text}"`
            }]
        };

        // Non-debatable motions that don't need a second go straight to voting
        if (!rules.requiresSecond && !rules.isDebatable) {
            updates.stage = MEETING_STAGES.VOTING;
            updates.voteStartTime = Date.now();
        }

        updateMeetingState(updates);
    };

    const handleRecognizePendingMotion = (index) => {
        if (pendingRecognitionLock.current) {
            return;
        }

        // Cannot recognize a motion while a member has the floor
        if (meetingState.currentSpeaker) {
            console.warn('Cannot recognize a motion while a member has the floor');
            return;
        }

        pendingRecognitionLock.current = true;

        try {
            const pendingList = meetingState.pendingMotions || [];
            const pending = pendingList[index];
            const baseLog = [...meetingState.log];
            if (!pending) {
                updateMeetingState({
                    log: [...baseLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: 'No pending motion found at that index.'
                    }]
                });
                return;
            }

            // Prepare metadata (amendments need degree/appliedTo at time of recognition)
            let metadata = pending.metadata || {};
            const top = getCurrentPendingQuestion(meetingState.motionStack);
            if (pending.motionType === MOTION_TYPES.AMEND && top) {
                const currentDegree = top.motionType === MOTION_TYPES.AMEND ? top.degree : 0;
                metadata = { ...metadata, degree: currentDegree + 1, appliedTo: top.id };
            }

            // Now push to stack via the normal subsidiary flow
            const entry = createMotionEntry(pending.motionType, pending.text, pending.proposer, metadata);
            if (entry.error) {
                updateMeetingState({
                    log: [...baseLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Could not create motion: ${entry.error}`
                    }]
                });
                return;
            }
            if (entry.requiresSecond) {
                entry.status = MOTION_STATUS.PENDING_SECOND;
            }

            // RONR: Rescind requires only a majority vote when previous notice was given
            if (pending.motionType === MOTION_TYPES.RESCIND && meetingState.meetingSettings?.previousNotice?.rescind) {
                entry.voteRequired = VOTE_THRESHOLDS.MAJORITY;
            }

            const { newStack, error } = pushMotion(meetingState.motionStack, entry);
            if (error) {
                updateMeetingState({
                    log: [...baseLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Chair could not recognize ${pending.displayName}: ${error}`
                    }]
                });
                return;
            }

            const savedSpeakingState = { ...meetingState.savedSpeakingState };
            if (top) {
                savedSpeakingState[top.id] = {
                    speakingQueue: meetingState.speakingQueue || [],
                    speakingHistory: meetingState.speakingHistory || [],
                    currentSpeaker: meetingState.currentSpeaker || null
                };
            }

            updateMeetingState({
                motionStack: newStack,
                pendingMotions: meetingState.pendingMotions.filter((_, i) => i !== index),
                savedSpeakingState,
                speakingQueue: [],
                speakingHistory: [],
                currentSpeaker: null,
                log: [...baseLog, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Chair recognizes ${pending.displayName} by ${pending.proposer}: "${pending.text}". Is there a second?`
                }]
            });
        } finally {
            pendingRecognitionLock.current = false;
        }
    };

    const handleDismissPendingMotion = (index) => {
        const pending = (meetingState.pendingMotions || [])[index];
        if (!pending) return;

        const remaining = meetingState.pendingMotions.filter((_, i) => i !== index);
        updateMeetingState({
            pendingMotions: remaining,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Chair declines ${pending.displayName} by ${pending.proposer}`
            }]
        });
    };

    const handleCallVote = () => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top) return;

        const newStack = updateTopMotion(meetingState.motionStack, {
            status: MOTION_STATUS.VOTING,
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: []
        });

        updateMeetingState({
            motionStack: newStack,
            stage: MEETING_STAGES.VOTING,
            voteStartTime: Date.now(),
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: [],
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The chair calls the question on: ${top.displayName}. All in favor?`
            }]
        });
    };

    const handleVote = (vote) => {
        if ((meetingState.votedBy || []).includes(currentUser.name)) return;

        const newVotes = { ...meetingState.votes };
        newVotes[vote] = (newVotes[vote] || 0) + 1;

        const votedBy = [...(meetingState.votedBy || []), currentUser.name];
        const voteDetails = [...(meetingState.voteDetails || []), { name: currentUser.name, vote }];

        // Also update votes on the top motion in the stack
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        let newStack = meetingState.motionStack;
        if (top) {
            const topVotes = { ...top.votes };
            topVotes[vote] = (topVotes[vote] || 0) + 1;
            newStack = updateTopMotion(meetingState.motionStack, {
                votes: topVotes,
                votedBy: [...(top.votedBy || []), currentUser.name]
            });
        }

        updateMeetingState({
            motionStack: newStack,
            votes: newVotes,
            votedBy: votedBy,
            voteDetails: voteDetails,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} voted`
            }]
        });
    };

    const handleAnnounceResult = () => {
        // Suspended rules standalone vote
        if (meetingState.suspendedVoteThreshold) {
            const { aye, nay } = meetingState.votes;
            const totalCast = aye + nay;
            const threshold = meetingState.suspendedVoteThreshold;
            let passed = false;
            if (threshold === 'majority') passed = totalCast > 0 && aye > totalCast / 2;
            else if (threshold === 'two_thirds') passed = totalCast > 0 && aye >= (totalCast * 2) / 3;
            else if (threshold === 'unanimous') passed = nay === 0 && aye > 0;

            updateMeetingState({
                stage: MEETING_STAGES.SUSPENDED_RULES,
                votes: { aye: 0, nay: 0, abstain: 0 },
                votedBy: [],
                suspendedVoteThreshold: null,
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Vote result: ${aye} ayes, ${nay} nays (${threshold.replace('_', '-')} required). Motion ${passed ? 'CARRIED' : 'FAILED'}.`
                }]
            });
            return;
        }

        // Minutes correction vote handling (legacy flow)
        if (meetingState.currentMotion?.isMinutesCorrectionVote) {
            const { aye, nay } = meetingState.votes;
            const totalCast = aye + nay;
            const result = totalCast > 0 && aye > totalCast / 2 ? 'carried' : 'failed';

            const newLog = [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Vote on minutes correction: ${aye} ayes, ${nay} nays. The correction ${result}.`
            }];
            updateMeetingState({
                stage: MEETING_STAGES.APPROVE_MINUTES,
                currentMotion: null,
                minutesCorrectionDebate: null,
                votes: { aye: 0, nay: 0, abstain: 0 },
                votedBy: [],
                currentSpeaker: null,
                speakingQueue: [],
                speakingHistory: [],
                log: newLog
            });
            return;
        }

        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top) return;

        // After 60 seconds, count non-voters as abstentions
        let votesForResult = meetingState.votes;
        if (meetingState.voteStartTime && (Date.now() - meetingState.voteStartTime >= 60000)) {
            const nonVoterCount = meetingState.participants.length - (meetingState.votedBy || []).length;
            if (nonVoterCount > 0) {
                votesForResult = {
                    ...meetingState.votes,
                    abstain: (meetingState.votes.abstain || 0) + nonVoterCount
                };
            }
        }

        // Build voting context from org profile for basis-aware vote determination
        const orgProfile = meetingState.orgProfile;
        const votingContext = orgProfile ? {
            majorityBasis: orgProfile.majorityBasis || 'votes_cast',
            twoThirdsBasis: orgProfile.twoThirdsBasis || 'votes_cast',
            membersPresent: meetingState.participants.length,
            entireMembership: parseInt(orgProfile.totalMembership) || meetingState.participants.length
        } : null;

        // Use the stack's votes for the result determination
        const entryForResult = { ...top, votes: votesForResult, voteRequired: top.voteRequired };
        const { result, description } = determineVoteResult(entryForResult, votingContext);

        const newLog = [...meetingState.log, {
            timestamp: new Date().toLocaleTimeString(),
            message: `Vote on ${top.displayName}: ${description}: "${top.text}"`
        }];

        // Handle the effect of adoption/defeat
        handleMotionDisposition(top, result, description, newLog);
    };

    const handleMotionDisposition = (motion, result, description, newLog) => {
        const { newStack, poppedMotion } = popMotion(meetingState.motionStack);
        const finalStatus = result === 'adopted' ? MOTION_STATUS.ADOPTED : MOTION_STATUS.DEFEATED;

        // Auto-dismiss moot pending motions when the stack is cleared
        // (e.g., Lay on Table adopted, Postpone Indefinitely adopted, Adjourn adopted)
        const motionsClearingStack = [
            MOTION_TYPES.LAY_ON_TABLE,
            MOTION_TYPES.POSTPONE_INDEFINITELY,
            MOTION_TYPES.POSTPONE_DEFINITELY,
            MOTION_TYPES.COMMIT,
            MOTION_TYPES.ADJOURN
        ];
        if (result === 'adopted' && motionsClearingStack.includes(motion.motionType)) {
            const pending = meetingState.pendingMotions || [];
            if (pending.length > 0) {
                const dismissedNames = pending.map(pm => pm.displayName).join(', ');
                newLog = [...newLog, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Pending motions auto-dismissed (object no longer exists): ${dismissedNames}`
                }];
                // We'll clear pendingMotions in the update below
            }
        }

        // Record in decided motions history
        const decidedEntry = {
            ...motion,
            status: finalStatus,
            result,
            description,
            decidedAt: Date.now()
        };
        const decidedMotions = [...(meetingState.decidedMotions || []), decidedEntry];

        // Restore speaking state from the motion below (if any)
        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        let restoredSpeaking = { speakingQueue: [], speakingHistory: [], currentSpeaker: null };

        const below = getCurrentPendingQuestion(newStack);
        if (below && savedSpeakingState[below.id]) {
            restoredSpeaking = savedSpeakingState[below.id];
            delete savedSpeakingState[below.id];
        }

        // Handle effects of adoption based on motion type
        if (result === 'adopted') {
            const effectResult = handleEffectOfAdoption(motion, newStack, newLog, savedSpeakingState, decidedMotions, restoredSpeaking);
            if (effectResult) return; // Effect handler took over the update
        }

        // Default disposition: pop and continue
        if (newStack.length === 0) {
            // All motions disposed of, back to new business
            // Dismiss any stale pending motions — no main motion to apply them to
            const stalePending = meetingState.pendingMotions || [];
            if (stalePending.length > 0) {
                const dismissedNames = stalePending.map(pm => pm.displayName).join(', ');
                newLog = [...newLog, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Pending motions auto-dismissed (no pending question): ${dismissedNames}`
                }];
            }
            updateMeetingState({
                motionStack: [],
                stage: MEETING_STAGES.NEW_BUSINESS,
                currentMotion: null,
                pendingAnnouncement: {
                    motionText: motion.text,
                    aye: meetingState.votes.aye,
                    nay: meetingState.votes.nay,
                    abstain: meetingState.votes.abstain,
                    result,
                    description,
                    displayName: motion.displayName,
                    voteRequired: motion.voteRequired,
                    voteDetails: meetingState.voteDetails || []
                },
                decidedMotions,
                votes: { aye: 0, nay: 0, abstain: 0 },
                votedBy: [],
                voteDetails: [],
                ...restoredSpeaking,
                savedSpeakingState,
                pendingAmendments: [],
                pendingMotions: [],
                log: newLog
            });
        } else {
            // Return to the motion below on the stack
            const nextTop = getCurrentPendingQuestion(newStack);
            const nextStage = nextTop.status === MOTION_STATUS.VOTING
                ? MEETING_STAGES.VOTING
                : nextTop.isDebatable
                    ? MEETING_STAGES.MOTION_DISCUSSION
                    : MEETING_STAGES.VOTING;

            updateMeetingState({
                motionStack: newStack,
                stage: nextStage,
                currentMotion: nextTop ? {
                    text: nextTop.text,
                    mover: nextTop.mover,
                    seconder: nextTop.seconder,
                    needsSecond: nextTop.status === MOTION_STATUS.PENDING_SECOND
                } : null,
                pendingAnnouncement: {
                    motionText: motion.text,
                    aye: meetingState.votes.aye,
                    nay: meetingState.votes.nay,
                    abstain: meetingState.votes.abstain,
                    result,
                    description,
                    displayName: motion.displayName,
                    voteRequired: motion.voteRequired,
                    voteDetails: meetingState.voteDetails || []
                },
                decidedMotions,
                votes: { aye: 0, nay: 0, abstain: 0 },
                votedBy: [],
                ...restoredSpeaking,
                savedSpeakingState,
                log: newLog
            });
        }
    };

    const handleEffectOfAdoption = (motion, currentStack, currentLog, savedSpeakingState, decidedMotions, restoredSpeaking) => {
        switch (motion.motionType) {
            case MOTION_TYPES.AMEND: {
                // Amend adopted: store amendment history and replace text with latest form
                if (motion.metadata?.appliedTo) {
                    const targetId = motion.metadata.appliedTo;
                    const target = getMotionById(currentStack, targetId);
                    // Use proposedText from metadata (full amended text); fallback for old amendments
                    const proposedText = motion.metadata?.proposedText || motion.text;
                    const existingHistory = target?.metadata?.amendmentHistory || [];
                    const newHistory = [...existingHistory, {
                        amendmentText: motion.text,
                        proposedText,
                        previousText: target?.text,
                        adoptedAt: Date.now()
                    }];
                    const newStack = updateMotionById(currentStack, targetId, {
                        text: proposedText,
                        metadata: {
                            ...(target?.metadata || {}),
                            amendmentHistory: newHistory,
                            originalText: target?.metadata?.originalText || target?.text
                        }
                    });
                    const nextTop = getCurrentPendingQuestion(newStack);

                    updateMeetingState({
                        motionStack: newStack,
                        stage: MEETING_STAGES.MOTION_DISCUSSION,
                        currentMotion: nextTop ? {
                            text: nextTop.text,
                            mover: nextTop.mover,
                            seconder: nextTop.seconder,
                            needsSecond: false
                        } : null,
                        pendingAnnouncement: {
                            motionText: motion.text,
                            aye: meetingState.votes.aye,
                            nay: meetingState.votes.nay,
                            abstain: meetingState.votes.abstain,
                            result: 'adopted',
                            description: 'Amendment adopted',
                            displayName: motion.displayName,
                            voteRequired: motion.voteRequired,
                            voteDetails: meetingState.voteDetails || []
                        },
                        decidedMotions,
                        votes: { aye: 0, nay: 0, abstain: 0 },
                        votedBy: [],
                        ...restoredSpeaking,
                        savedSpeakingState,
                        log: [...currentLog, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: 'Amendment adopted. Debate continues on the motion as amended.'
                        }]
                    });
                    return true;
                }
                return false;
            }

            case MOTION_TYPES.PREVIOUS_QUESTION: {
                // Previous Question adopted: immediately move to vote on the next pending question
                const nextTop = getCurrentPendingQuestion(currentStack);
                if (nextTop) {
                    const votingStack = updateTopMotion(currentStack, {
                        status: MOTION_STATUS.VOTING,
                        votes: { aye: 0, nay: 0, abstain: 0 },
                        votedBy: []
                    });

                    updateMeetingState({
                        motionStack: votingStack,
                        stage: MEETING_STAGES.VOTING,
                        voteStartTime: Date.now(),
                        currentMotion: nextTop ? {
                            text: nextTop.text,
                            mover: nextTop.mover,
                            seconder: nextTop.seconder,
                            needsSecond: false
                        } : null,
                        decidedMotions,
                        votes: { aye: 0, nay: 0, abstain: 0 },
                        votedBy: [],
                        speakingQueue: [],
                        speakingHistory: [],
                        currentSpeaker: null,
                        savedSpeakingState,
                        log: [...currentLog, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: 'Previous question ordered. Debate is closed. Proceeding to immediate vote.'
                        }]
                    });
                    return true;
                }
                return false;
            }

            case MOTION_TYPES.LAY_ON_TABLE: {
                // Save the entire remaining stack to tabledMotions
                const mainMotion = getMainMotion(currentStack);
                const tabledEntry = {
                    stack: currentStack,
                    mainMotionText: mainMotion?.text || 'Unknown motion',
                    tabledAt: Date.now(),
                    savedSpeakingState
                };

                updateMeetingState({
                    motionStack: [],
                    stage: MEETING_STAGES.NEW_BUSINESS,
                    currentMotion: null,
                    tabledMotions: [...(meetingState.tabledMotions || []), tabledEntry],
                    decidedMotions,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    speakingQueue: [],
                    speakingHistory: [],
                    currentSpeaker: null,
                    savedSpeakingState: {},
                    pendingAmendments: [],
                    pendingMotions: [],
                    log: [...currentLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Motion laid on the table: "${mainMotion?.text}"`
                    }]
                });
                return true;
            }

            case MOTION_TYPES.POSTPONE_DEFINITELY: {
                // Save the stack with time, clear
                const mainMotion = getMainMotion(currentStack);
                const postponedEntry = {
                    stack: currentStack,
                    mainMotionText: mainMotion?.text || 'Unknown motion',
                    postponeTime: motion.metadata?.postponeTime,
                    postponedAt: Date.now(),
                    savedSpeakingState
                };

                updateMeetingState({
                    motionStack: [],
                    stage: MEETING_STAGES.NEW_BUSINESS,
                    currentMotion: null,
                    tabledMotions: [...(meetingState.tabledMotions || []), postponedEntry],
                    decidedMotions,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    speakingQueue: [],
                    speakingHistory: [],
                    currentSpeaker: null,
                    savedSpeakingState: {},
                    pendingAmendments: [],
                    pendingMotions: [],
                    log: [...currentLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Motion postponed until ${motion.metadata?.postponeTime || 'a later time'}: "${mainMotion?.text}"`
                    }]
                });
                return true;
            }

            case MOTION_TYPES.COMMIT: {
                // Refer to committee: save main motion with committee details, clear stack
                const mainMotion = getMainMotion(currentStack);

                updateMeetingState({
                    motionStack: [],
                    stage: MEETING_STAGES.NEW_BUSINESS,
                    currentMotion: null,
                    decidedMotions,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    speakingQueue: [],
                    speakingHistory: [],
                    currentSpeaker: null,
                    savedSpeakingState: {},
                    pendingAmendments: [],
                    pendingMotions: [],
                    log: [...currentLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Motion referred to ${motion.metadata?.committeeName || 'committee'}: "${mainMotion?.text}"`
                    }]
                });
                return true;
            }

            case MOTION_TYPES.POSTPONE_INDEFINITELY: {
                // Kill the main motion entirely
                updateMeetingState({
                    motionStack: [],
                    stage: MEETING_STAGES.NEW_BUSINESS,
                    currentMotion: null,
                    decidedMotions,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    speakingQueue: [],
                    speakingHistory: [],
                    currentSpeaker: null,
                    savedSpeakingState: {},
                    pendingAmendments: [],
                    pendingMotions: [],
                    log: [...currentLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: 'Motion postponed indefinitely (killed).'
                    }]
                });
                return true;
            }

            case MOTION_TYPES.LIMIT_DEBATE: {
                // Apply debate limits to the motion below
                const nextTop = getCurrentPendingQuestion(currentStack);
                if (nextTop && motion.metadata?.debateLimits) {
                    const newStack = updateTopMotion(currentStack, {
                        metadata: {
                            ...nextTop.metadata,
                            debateLimits: motion.metadata.debateLimits
                        }
                    });

                    updateMeetingState({
                        motionStack: newStack,
                        stage: MEETING_STAGES.MOTION_DISCUSSION,
                        currentMotion: nextTop ? {
                            text: nextTop.text,
                            mover: nextTop.mover,
                            seconder: nextTop.seconder,
                            needsSecond: false
                        } : null,
                        decidedMotions,
                        votes: { aye: 0, nay: 0, abstain: 0 },
                        votedBy: [],
                        ...restoredSpeaking,
                        savedSpeakingState,
                        log: [...currentLog, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: 'Debate limits adopted and applied.'
                        }]
                    });
                    return true;
                }
                return false;
            }

            case MOTION_TYPES.ADJOURN: {
                // Adjourn the meeting
                updateMeetingState({
                    motionStack: [],
                    stage: MEETING_STAGES.ADJOURNED,
                    currentMotion: null,
                    decidedMotions,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    speakingQueue: [],
                    speakingHistory: [],
                    currentSpeaker: null,
                    savedSpeakingState: {},
                    pendingMotions: [],
                    log: [...currentLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: 'Motion to adjourn adopted. Meeting adjourned.'
                    }]
                });
                return true;
            }

            case MOTION_TYPES.RECESS: {
                // Enter recess
                updateMeetingState({
                    motionStack: currentStack,
                    stage: MEETING_STAGES.RECESS,
                    decidedMotions,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    recessEnd: Date.now() + (motion.metadata?.recessDuration || 10) * 60000,
                    savedSpeakingState,
                    log: [...currentLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Meeting in recess for ${motion.metadata?.recessDuration || 10} minutes.`
                    }]
                });
                return true;
            }

            case MOTION_TYPES.SUSPEND_RULES: {
                // Enter suspended rules mode
                const suspendedPurpose = motion.metadata?.suspendedRulesPurpose || motion.text;
                updateMeetingState({
                    motionStack: currentStack,
                    stage: MEETING_STAGES.SUSPENDED_RULES,
                    suspendedRulesContext: {
                        previousStage: currentStack.length > 0 ? MEETING_STAGES.MOTION_DISCUSSION : MEETING_STAGES.NEW_BUSINESS,
                        motionStack: currentStack,
                        savedSpeakingState
                    },
                    suspendedRulesPurpose: suspendedPurpose,
                    currentMotion: null,
                    decidedMotions,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    log: [...currentLog, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Rules suspended: "${suspendedPurpose}"`
                    }]
                });
                return true;
            }

            case MOTION_TYPES.APPEAL: {
                // Appeal decided - result determines if chair is sustained
                const nextTop = getCurrentPendingQuestion(currentStack);
                updateMeetingState({
                    motionStack: currentStack,
                    stage: currentStack.length > 0 ? MEETING_STAGES.MOTION_DISCUSSION : MEETING_STAGES.NEW_BUSINESS,
                    currentMotion: nextTop ? {
                        text: nextTop.text,
                        mover: nextTop.mover,
                        seconder: nextTop.seconder,
                        needsSecond: false
                    } : null,
                    decidedMotions,
                    lastChairRuling: null,
                    votes: { aye: 0, nay: 0, abstain: 0 },
                    votedBy: [],
                    ...restoredSpeaking,
                    savedSpeakingState,
                    log: currentLog
                });
                return true;
            }

            default:
                return false;
        }
    };

    // ========== BRING-BACK MOTIONS ==========

    const handleTakeFromTable = (index) => {
        const tabledMotions = meetingState.tabledMotions || [];
        if (index < 0 || index >= tabledMotions.length) return;

        const tabled = tabledMotions[index];
        const remainingTabled = tabledMotions.filter((_, i) => i !== index);

        updateMeetingState({
            motionStack: tabled.stack,
            tabledMotions: remainingTabled,
            savedSpeakingState: tabled.savedSpeakingState || {},
            stage: MEETING_STAGES.MOTION_DISCUSSION,
            currentMotion: tabled.stack.length > 0 ? {
                text: tabled.stack[0].text,
                mover: tabled.stack[0].mover,
                seconder: tabled.stack[0].seconder,
                needsSecond: false
            } : null,
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Motion taken from the table: "${tabled.mainMotionText}"`
            }]
        });
    };

    const handleReconsider = (index) => {
        const decidedMotions = meetingState.decidedMotions || [];
        if (index < 0 || index >= decidedMotions.length) return;

        const decided = decidedMotions[index];

        // RONR: only someone who voted on the prevailing side can move to reconsider
        if (decided.votedBy && decided.result) {
            const prevailingSide = decided.result === 'adopted' ? 'aye' : 'nay';
            // Check if the user voted at all on this motion
            const userVoted = (decided.votedBy || []).includes(currentUser.name);
            if (!userVoted) {
                updateMeetingState({
                    log: [...meetingState.log, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `${currentUser.name} cannot move to reconsider: only members who voted on the prevailing side (${prevailingSide}) may do so.`
                    }]
                });
                return;
            }
        }

        const entry = createMotionEntry(MOTION_TYPES.MAIN, decided.text, currentUser.name);
        if (entry.error) return;

        const { newStack, error } = pushMotion([], entry);
        if (error) return;

        updateMeetingState({
            motionStack: newStack,
            stage: MEETING_STAGES.NEW_BUSINESS,
            currentMotion: { text: decided.text, mover: currentUser.name, needsSecond: true },
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} moves to reconsider: "${decided.text}"`
            }]
        });
    };

    // ========== SPEAKING / DEBATE ==========

    const sortSpeakingQueue = (queue, moverName) => {
        // 1. Mover first (if in queue and hasn't spoken)
        const moverEntry = moverName ? queue.find(q => q.participant === moverName && !q.hasSpokenBefore) : null;
        const rest = moverEntry ? queue.filter(q => q !== moverEntry) : queue;

        // Split into new and repeat speakers
        const newSpeakers = rest.filter(q => !q.hasSpokenBefore);
        const repeatSpeakers = rest.filter(q => q.hasSpokenBefore);

        // 2. Within each group, sort by lastSpokeTime ascending (longest since speaking first), then requestTime
        const sortByPriority = (group) => {
            return group.sort((a, b) => {
                const aTime = a.lastSpokeTime || 0;
                const bTime = b.lastSpokeTime || 0;
                if (aTime !== bTime) return aTime - bTime;
                return a.requestTime - b.requestTime;
            });
        };

        // 3. Alternate pro/con within each group
        const alternateProCon = (group) => {
            const pro = sortByPriority(group.filter(q => q.stance === 'pro'));
            const con = sortByPriority(group.filter(q => q.stance === 'con'));
            const sorted = [];

            while (pro.length > 0 || con.length > 0) {
                if (pro.length > 0) sorted.push(pro.shift());
                if (con.length > 0) sorted.push(con.shift());
            }

            return sorted;
        };

        const result = [];
        if (moverEntry) result.push(moverEntry);
        result.push(...alternateProCon(newSpeakers));
        result.push(...alternateProCon(repeatSpeakers));
        return result;
    };

    const handleRequestToSpeak = (stance) => {
        // Check if debate is allowed on the current question (skip check in suspended mode)
        if (meetingState.stage !== MEETING_STAGES.SUSPENDED_RULES && !isDebateAllowed(meetingState.motionStack)) {
            return; // Silently ignore - UI should hide the button
        }

        const speakingHistory = meetingState.speakingHistory || [];
        const hasSpokenBefore = speakingHistory.some(h =>
            typeof h === 'string' ? h === currentUser.name : h.name === currentUser.name
        );
        const lastSpokeTime = speakingHistory.reduce((t, h) => {
            if (typeof h === 'string') return h === currentUser.name ? 1 : t;
            return h.name === currentUser.name ? h.lastSpokeTime : t;
        }, 0);

        const newQueue = [...meetingState.speakingQueue, {
            participant: currentUser.name,
            stance: stance,
            requestTime: Date.now(),
            hasSpokenBefore: hasSpokenBefore,
            lastSpokeTime: lastSpokeTime
        }];

        const top = getCurrentPendingQuestion(meetingState.motionStack);
        const sortedQueue = sortSpeakingQueue(newQueue, top?.mover);

        updateMeetingState({
            speakingQueue: sortedQueue,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} requested to speak (${stance})`
            }]
        });
    };

    const handleRecognizeSpeaker = () => {
        if (meetingState.speakingQueue.length === 0) return;

        const nextSpeaker = { ...meetingState.speakingQueue[0], speakingStartTime: Date.now() };
        const remainingQueue = meetingState.speakingQueue.slice(1);

        updateMeetingState({
            currentSpeaker: nextSpeaker,
            speakingQueue: remainingQueue,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The chair recognizes ${nextSpeaker.participant}`
            }]
        });
    };

    const handleFinishSpeaking = () => {
        if (!meetingState.currentSpeaker) return;
        const speakerName = meetingState.currentSpeaker.participant;
        const speakingHistory = meetingState.speakingHistory || [];
        const now = Date.now();

        // Update or add entry with new lastSpokeTime
        // Handle both old string[] format and new object[] format
        const existingIdx = speakingHistory.findIndex(h =>
            typeof h === 'string' ? h === speakerName : h.name === speakerName
        );

        let updatedHistory;
        if (existingIdx >= 0) {
            updatedHistory = speakingHistory.map((h, i) => {
                if (i !== existingIdx) return typeof h === 'string' ? { name: h, lastSpokeTime: 0 } : h;
                return { name: speakerName, lastSpokeTime: now };
            });
        } else {
            // Migrate any old string entries and add new one
            updatedHistory = [
                ...speakingHistory.map(h => typeof h === 'string' ? { name: h, lastSpokeTime: 0 } : h),
                { name: speakerName, lastSpokeTime: now }
            ];
        }

        const shouldResumeSuspendedList =
            meetingState.stage === MEETING_STAGES.SUSPENDED_RULES &&
            meetingState.suspendedSpeakingState &&
            meetingState.speakingQueue.length === 0;

        if (shouldResumeSuspendedList) {
            const restored = meetingState.suspendedSpeakingState;
            updateMeetingState({
                currentSpeaker: restored.currentSpeaker || null,
                speakingQueue: restored.speakingQueue || [],
                speakingHistory: restored.speakingHistory || [],
                suspendedSpeakingState: null,
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `${speakerName} yields the floor`
                }, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: 'Temporary speaking list completed. Resuming previous list.'
                }]
            });
            return;
        }

        // Re-sort remaining queue with updated history
        const resortedQueue = meetingState.speakingQueue.map(entry => {
            const historyEntry = updatedHistory.find(h => h.name === entry.participant);
            return {
                ...entry,
                hasSpokenBefore: !!historyEntry,
                lastSpokeTime: historyEntry?.lastSpokeTime || entry.lastSpokeTime || 0
            };
        });
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        const sortedQueue = sortSpeakingQueue(resortedQueue, top?.mover);

        updateMeetingState({
            currentSpeaker: null,
            speakingHistory: updatedHistory,
            speakingQueue: sortedQueue,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${speakerName} yields the floor`
            }]
        });
    };

    // ========== INCIDENTAL MOTIONS / PENDING REQUESTS ==========

    const handleRaisePendingRequest = (type, content) => {
        const request = createRequest(type, currentUser.name, content);
        if (request.error) {
            console.error(request.error);
            return;
        }

        updateMeetingState({
            pendingRequests: [...(meetingState.pendingRequests || []), request],
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} raises: ${request.displayName}${content ? ` - "${content}"` : ''}`
            }]
        });
    };

    const handleAcceptRequest = (requestId) => {
        const updated = acceptRequest(meetingState.pendingRequests || [], requestId);
        const request = updated.find(r => r.id === requestId);

        updateMeetingState({
            pendingRequests: updated,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Chair accepts ${request?.displayName} from ${request?.raisedBy}`
            }]
        });
    };

    const handleRespondToRequest = (requestId, response) => {
        const updated = respondToRequest(meetingState.pendingRequests || [], requestId);
        const request = updated.find(r => r.id === requestId);

        // Also update with the response text
        const withResponse = updated.map(r =>
            r.id === requestId ? { ...r, response } : r
        );

        updateMeetingState({
            pendingRequests: withResponse,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Chair responds to ${request?.displayName}: "${response}"`
            }]
        });
    };

    const handleDismissRequest = (requestId) => {
        const updated = dismissRequest(meetingState.pendingRequests || [], requestId);

        updateMeetingState({
            pendingRequests: updated.filter(r => r.status !== 'dismissed'),
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Request dismissed`
            }]
        });
    };

    const handleRuleOnPointOfOrderRequest = (requestId, ruling) => {
        const request = (meetingState.pendingRequests || []).find(r => r.id === requestId);
        if (!request) return;

        const updated = dismissRequest(meetingState.pendingRequests || [], requestId);

        updateMeetingState({
            pendingRequests: updated.filter(r => r.status !== 'dismissed'),
            lastChairRuling: {
                type: 'point_of_order',
                ruling,
                concern: request.content,
                raisedBy: request.raisedBy,
                timestamp: Date.now()
            },
            chairDecisionTime: Date.now(),
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Chair rules: ${ruling}. Point of order by ${request.raisedBy} ${ruling === 'sustained' ? 'SUSTAINED' : 'NOT SUSTAINED'}.`
            }]
        });
    };

    const handleConvertRequestToMotion = (requestType, text, metadata = {}) => {
        const rules = getRules(requestType);
        if (!rules) return;

        // If a speaker has the floor and this motion cannot interrupt, queue as pending
        if (meetingState.currentSpeaker && !rules.canInterrupt) {
            const pendingMotions = [...(meetingState.pendingMotions || []), {
                motionType: requestType,
                text,
                proposer: currentUser.name,
                displayName: rules.displayName,
                metadata
            }];
            updateMeetingState({
                pendingMotions,
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `${currentUser.name} moves: ${rules.displayName} - "${text}" (queued — a member has the floor)`
                }]
            });
            return;
        }

        // Otherwise, push directly onto the stack
        const entry = createMotionEntry(requestType, text, currentUser.name, metadata);
        if (entry.error) return;

        // RONR: Rescind requires only a majority vote when previous notice was given
        if (requestType === MOTION_TYPES.RESCIND && meetingState.meetingSettings?.previousNotice?.rescind) {
            entry.voteRequired = VOTE_THRESHOLDS.MAJORITY;
        }

        const { newStack, error } = pushMotion(meetingState.motionStack, entry);
        if (error) {
            updateMeetingState({
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Motion could not be recognized: ${error}`
                }]
            });
            return;
        }

        // Save speaking state
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        if (top) {
            savedSpeakingState[top.id] = {
                speakingQueue: meetingState.speakingQueue,
                speakingHistory: meetingState.speakingHistory,
                currentSpeaker: meetingState.currentSpeaker
            };
        }

        updateMeetingState({
            motionStack: newStack,
            savedSpeakingState,
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} moves: ${rules.displayName} - "${text}"`
            }]
        });
    };

    const handleDivisionOfAssembly = () => {
        const divResult = handleDivision(meetingState.votes);

        // Reset votes on the top motion too
        let newStack = meetingState.motionStack;
        const top = getCurrentPendingQuestion(newStack);
        if (top) {
            newStack = updateTopMotion(newStack, {
                votes: { aye: 0, nay: 0, abstain: 0 },
                votedBy: []
            });
        }

        updateMeetingState({
            motionStack: newStack,
            votes: divResult.votes,
            votedBy: divResult.votedBy,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: divResult.message
            }]
        });
    };

    const handleReformulateMotion = (newText) => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top || top.status !== MOTION_STATUS.PENDING_CHAIR) return;

        const { newStack } = popMotion(meetingState.motionStack);

        // Create a new motion entry with the reformulated text
        const entry = createMotionEntry(top.motionType, newText, top.mover, top.metadata || {});
        if (entry.error) return;

        const { newStack: updatedStack, error } = pushMotion(newStack, entry);
        if (error) return;

        updateMeetingState({
            motionStack: updatedStack,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${top.mover} reformulates the motion: "${newText}"`
            }]
        });
    };

    const handleWithdrawMotion = () => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top) return;

        const { newStack } = popMotion(meetingState.motionStack);

        // Restore speaking state
        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        let restoredSpeaking = { speakingQueue: [], speakingHistory: [], currentSpeaker: null };
        const below = getCurrentPendingQuestion(newStack);
        if (below && savedSpeakingState[below.id]) {
            restoredSpeaking = savedSpeakingState[below.id];
            delete savedSpeakingState[below.id];
        }

        updateMeetingState({
            motionStack: newStack,
            stage: newStack.length > 0 ? MEETING_STAGES.MOTION_DISCUSSION : MEETING_STAGES.NEW_BUSINESS,
            currentMotion: below ? {
                text: below.text,
                mover: below.mover,
                seconder: below.seconder,
                needsSecond: false
            } : null,
            ...restoredSpeaking,
            savedSpeakingState,
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: [],
            pendingAmendments: newStack.length === 0 ? [] : meetingState.pendingAmendments,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Motion withdrawn: "${top.text}"`
            }]
        });
    };

    // ========== SUSPENDED RULES ==========

    const handleResumeFromSuspendedRules = () => {
        const ctx = meetingState.suspendedRulesContext;
        if (!ctx) {
            // Fallback: just go to new business
            updateMeetingState({
                stage: MEETING_STAGES.NEW_BUSINESS,
                suspendedRulesContext: null,
                suspendedSpeakingState: null,
                suspendedRulesPurpose: null,
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: 'Rules resumed.'
                }]
            });
            return;
        }

        const top = getCurrentPendingQuestion(ctx.motionStack);
        updateMeetingState({
            stage: ctx.previousStage,
            motionStack: ctx.motionStack,
            savedSpeakingState: ctx.savedSpeakingState || {},
            suspendedSpeakingState: null,
            suspendedRulesContext: null,
            suspendedRulesPurpose: null,
            currentMotion: top ? {
                text: top.text,
                mover: top.mover,
                seconder: top.seconder,
                needsSecond: false
            } : null,
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Rules resumed.'
            }]
        });
    };

    const handleSuspendedVote = (threshold) => {
        // Standalone vote in suspended mode — enter voting stage with chosen threshold
        updateMeetingState({
            stage: MEETING_STAGES.VOTING,
            voteStartTime: Date.now(),
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: [],
            suspendedVoteThreshold: threshold,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The chair calls a vote (${threshold.replace('_', '-')} required).`
            }]
        });
    };

    const handleNewSpeakingList = () => {
        if (meetingState.stage !== MEETING_STAGES.SUSPENDED_RULES) return;

        const hasSaved = !!meetingState.suspendedSpeakingState;
        const suspendedSpeakingState = hasSaved ? meetingState.suspendedSpeakingState : {
            speakingQueue: meetingState.speakingQueue,
            speakingHistory: meetingState.speakingHistory,
            currentSpeaker: meetingState.currentSpeaker
        };

        updateMeetingState({
            suspendedSpeakingState,
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: hasSaved
                    ? 'The chair opens a new temporary speaking list.'
                    : 'The chair opens a temporary speaking list (previous list paused).'
            }]
        });
    };

    const handleResumePreviousSpeakingList = () => {
        if (meetingState.stage !== MEETING_STAGES.SUSPENDED_RULES) return;
        if (!meetingState.suspendedSpeakingState) return;

        const restored = meetingState.suspendedSpeakingState;
        updateMeetingState({
            speakingQueue: restored.speakingQueue || [],
            speakingHistory: restored.speakingHistory || [],
            currentSpeaker: restored.currentSpeaker || null,
            suspendedSpeakingState: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'The chair resumes the previous speaking list.'
            }]
        });
    };

    // ========== RECESS ==========

    const handleResumeFromRecess = () => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);

        updateMeetingState({
            stage: meetingState.motionStack.length > 0
                ? MEETING_STAGES.MOTION_DISCUSSION
                : MEETING_STAGES.NEW_BUSINESS,
            recessEnd: null,
            currentMotion: top ? {
                text: top.text,
                mover: top.mover,
                seconder: top.seconder,
                needsSecond: false
            } : null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Meeting resumed from recess.'
            }]
        });
    };

    // ========== LEGACY HANDLERS (kept for backward compat) ==========

    const handleAcknowledgeAnnouncement = () => {
        if (!meetingState.pendingAnnouncement) return;

        const returningToDebate = meetingState.stage === MEETING_STAGES.MOTION_DISCUSSION;
        updateMeetingState({
            pendingAnnouncement: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: returningToDebate
                    ? 'Chair continues debate on the pending question.'
                    : 'Chair proceeded to New Business.'
            }]
        });
    };

    const handleAdjourn = () => {
        // When no business is pending, adjourn is not a motion
        if (meetingState.motionStack.length === 0) {
            updateMeetingState({
                stage: MEETING_STAGES.ADJOURNED,
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: 'Meeting adjourned'
                }]
            });
        } else {
            // With business pending, adjourn is a privileged motion
            handleConvertRequestToMotion(MOTION_TYPES.ADJOURN, 'to adjourn');
        }
    };

    const handleSubmitAmendment = (amendmentLanguage, proposedText) => {
        // Route through the subsidiary motion system
        // RONR language goes as motion text; full proposed text stored in metadata
        handleMoveSubsidiary(MOTION_TYPES.AMEND, amendmentLanguage, { proposedText });
    };

    const handleRecognizeAmendment = (amendment) => {
        // Cannot recognize an amendment while a member has the floor
        if (meetingState.currentSpeaker) {
            console.warn('Cannot recognize a motion while a member has the floor');
            return;
        }

        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top) return;

        const metadata = { ...amendment.metadata, proposer: amendment.proposer };
        const currentDegree = top.motionType === MOTION_TYPES.AMEND ? top.degree : 0;
        metadata.degree = currentDegree + 1;
        metadata.appliedTo = top.id;

        const entry = createMotionEntry(MOTION_TYPES.AMEND, amendment.text, amendment.proposer, metadata);
        if (entry.error) return;
        if (entry.requiresSecond) {
            entry.status = MOTION_STATUS.PENDING_SECOND;
        }

        const { newStack, error } = pushMotion(meetingState.motionStack, entry);
        if (error) return;

        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        savedSpeakingState[top.id] = {
            speakingQueue: meetingState.speakingQueue,
            speakingHistory: meetingState.speakingHistory,
            currentSpeaker: meetingState.currentSpeaker
        };

        updateMeetingState({
            motionStack: newStack,
            pendingAmendments: (meetingState.pendingAmendments || []).filter(a => a !== amendment),
            savedSpeakingState,
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Chair recognizes amendment by ${amendment.proposer}: "${amendment.text}". Is there a second?`
            }]
        });
    };

    const handleDismissAmendment = (amendment) => {
        updateMeetingState({
            pendingAmendments: (meetingState.pendingAmendments || []).filter(a => a !== amendment),
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Chair declines to recognize amendment from ${amendment.proposer}`
            }]
        });
    };

    const handleSecondAmendment = () => {
        // The amendment is already on the stack via handleMoveSubsidiary;
        // just call handleSecondMotion which seconds the top of stack
        handleSecondMotion();
    };

    const handleSubmitPointOfOrder = (concern) => {
        handleRaisePendingRequest(MOTION_TYPES.POINT_OF_ORDER, concern);
    };

    const handleSubmitMinutesCorrection = (correction) => {
        const corrections = meetingState.minutesCorrections || [];
        updateMeetingState({
            minutesCorrections: [...corrections, {
                proposedBy: currentUser.name,
                text: correction,
                timestamp: Date.now()
            }],
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} proposes correction to minutes: ${correction}`
            }]
        });
    };

    const handleObjectToCorrection = () => {
        const correction = meetingState.minutesCorrections[0];
        updateMeetingState({
            minutesCorrectionDebate: correction,
            minutesCorrections: meetingState.minutesCorrections.slice(1),
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Objection raised to minutes correction. The correction is now before the assembly.'
            }]
        });
    };

    const handleAcceptCorrectionByConsent = () => {
        const correction = meetingState.minutesCorrections[0];
        updateMeetingState({
            minutesCorrections: meetingState.minutesCorrections.slice(1),
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Minutes corrected by consent: ${correction.text}`
            }]
        });
    };

    const handleRuleOnPointOfOrder = (ruling) => {
        // Legacy handler - route through pending requests if there's a pending request,
        // otherwise use legacy flow
        const pendingPOO = (meetingState.pendingRequests || []).find(
            r => r.type === MOTION_TYPES.POINT_OF_ORDER && r.status === 'pending'
        );
        if (pendingPOO) {
            handleRuleOnPointOfOrderRequest(pendingPOO.id, ruling);
        } else if (meetingState.pendingPointOfOrder) {
            // Legacy fallback
            const point = meetingState.pendingPointOfOrder;
            updateMeetingState({
                pendingPointOfOrder: null,
                lastChairRuling: {
                    type: 'point_of_order',
                    ruling,
                    concern: point.concern,
                    raisedBy: point.raisedBy,
                    timestamp: Date.now()
                },
                chairDecisionTime: Date.now(),
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Chair rules: ${ruling}. Point of order by ${point.raisedBy} ${ruling === 'sustained' ? 'SUSTAINED' : 'NOT SUSTAINED'}.`
                }]
            });
        }
    };

    const handleCallVoteOnMinutesCorrection = () => {
        const correction = meetingState.minutesCorrectionDebate;
        if (!correction) return;

        updateMeetingState({
            stage: MEETING_STAGES.VOTING,
            voteStartTime: Date.now(),
            currentMotion: {
                text: `to approve the proposed correction to the minutes: "${correction.text}"`,
                mover: currentUser.name,
                needsSecond: false,
                isMinutesCorrectionVote: true
            },
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: [],
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'The chair puts the minutes correction to a vote.'
            }]
        });
    };

    const handleSubmitIncidental = (incidentalType) => {
        // Route to proper handlers based on type
        switch (incidentalType) {
            case 'Point of Order':
                // This is handled through the modal system
                break;
            case 'Appeal the Decision of the Chair':
                // Will be handled through AppealModal
                break;
            case 'Parliamentary Inquiry':
            case 'Request for Information':
            case 'Division of the Assembly':
            case 'Suspend the Rules':
                // These now route through proper modal system
                break;
            default:
                // Fallback: just log
                updateMeetingState({
                    log: [...meetingState.log, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `${currentUser.name} raises: ${incidentalType}`
                    }]
                });
        }
    };

    const handleLogout = () => {
        if (currentUser.role === ROLES.PRESIDENT) {
            const viceChair = meetingState.participants.find(p => p.role === ROLES.VICE_PRESIDENT);

            if (viceChair) {
                const updatedParticipants = meetingState.participants.filter(p => p.name !== currentUser.name);
                const promoted = { ...viceChair, role: ROLES.PRESIDENT };
                const finalParticipants = updatedParticipants.map(p =>
                    p.name === viceChair.name ? promoted : p
                );

                updateMeetingState({
                    participants: finalParticipants,
                    log: [...meetingState.log, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Chair ${currentUser.name} has left. Vice Chair ${viceChair.name} assumes the chair.`
                    }]
                });
            } else {
                const remaining = meetingState.participants.filter(p => p.name !== currentUser.name);

                if (remaining.length === 0) {
                    updateMeetingState({
                        stage: MEETING_STAGES.ADJOURNED,
                        log: [...meetingState.log, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `Chair ${currentUser.name} has left. No members remain. Meeting automatically adjourned.`
                        }]
                    });
                } else {
                    // Pick a random remaining member to become Chair
                    const newChair = remaining[Math.floor(Math.random() * remaining.length)];
                    const finalParticipants = remaining.map(p =>
                        p.name === newChair.name ? { ...p, role: ROLES.PRESIDENT } : p
                    );

                    updateMeetingState({
                        participants: finalParticipants,
                        log: [...meetingState.log, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `Chair ${currentUser.name} has left. ${newChair.name} has been randomly selected as Chair.`
                        }]
                    });
                }
            }
        } else {
            const updatedParticipants = meetingState.participants.filter(p => p.name !== currentUser.name);
            updateMeetingState({
                participants: updatedParticipants,
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: `${currentUser.name} has left the meeting.`
                }]
            });
        }

        sessionStorage.removeItem('hatsell_session');
        MeetingConnection.disconnect();
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    // ========== ORDERS OF THE DAY ==========

    const handleOrdersOfTheDay = () => {
        updateMeetingState({
            ordersOfTheDayDemand: { demandedBy: currentUser.name, timestamp: Date.now() },
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} calls for the Orders of the Day`
            }]
        });
    };

    const handleOrdersOfTheDayResponse = (comply) => {
        if (comply) {
            // Return to agenda-appropriate stage (new business)
            updateMeetingState({
                ordersOfTheDayDemand: null,
                stage: MEETING_STAGES.NEW_BUSINESS,
                currentSpeaker: null,
                speakingQueue: [],
                log: [...meetingState.log, {
                    timestamp: new Date().toLocaleTimeString(),
                    message: 'Chair returns to the Orders of the Day'
                }]
            });
        } else {
            // Initiate "Suspend the Rules" vote (2/3 required) to continue current business
            const entry = createMotionEntry(
                MOTION_TYPES.SUSPEND_RULES,
                'Suspend the rules to continue with the current business',
                currentUser.name,
                { suspendedRulesPurpose: 'Continue with current business out of agenda order' }
            );

            if (!entry.error) {
                // Skip second requirement for this procedural motion
                entry.status = MOTION_STATUS.PENDING_SECOND;
                const { newStack } = pushMotion(meetingState.motionStack, entry);

                updateMeetingState({
                    ordersOfTheDayDemand: null,
                    motionStack: newStack || meetingState.motionStack,
                    log: [...meetingState.log, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: 'Chair moves to suspend the rules to continue with current business (requires 2/3 vote). Is there a second?'
                    }]
                });
            } else {
                updateMeetingState({
                    ordersOfTheDayDemand: null,
                    stage: MEETING_STAGES.NEW_BUSINESS,
                    log: [...meetingState.log, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: 'Chair returns to the Orders of the Day (unable to initiate suspend the rules)'
                    }]
                });
            }
        }
    };

    const handleClearMeeting = async () => {
        if (confirm('Are you sure you want to clear all meeting data? This will end the meeting for all participants.')) {
            await MeetingConnection.clearState();
            sessionStorage.removeItem('hatsell_session');
            MeetingConnection.disconnect();
            setIsLoggedIn(false);
            setCurrentUser(null);
            setMeetingState(INITIAL_MEETING_STATE);
        }
    };

    return {
        isLoggedIn,
        currentUser,
        meetingState,
        setMeetingState,
        updateMeetingState,
        addToLog,
        handleLogin,
        handleCallToOrder,
        handleRollCall,
        handleCallMember,
        handleMarkPresent,
        handleRespondToRollCall,
        handleApproveMinutes,
        handleNewMotion,
        handleSecondMotion,
        handleRequestToSpeak,
        handleRecognizeSpeaker,
        handleFinishSpeaking,
        handleCallVote,
        handleCallVoteOnMinutesCorrection,
        handleVote,
        handleAnnounceResult,
        handleAcknowledgeAnnouncement,
        handleAdjourn,
        handleSubmitAmendment,
        handleRecognizeAmendment,
        handleDismissAmendment,
        handleSecondAmendment,
        handleSubmitPointOfOrder,
        handleSubmitMinutesCorrection,
        handleObjectToCorrection,
        handleAcceptCorrectionByConsent,
        handleRuleOnPointOfOrder,
        handleLogout,
        handleClearMeeting,
        handleSubmitIncidental,

        // New handlers
        handleMoveSubsidiary,
        handleRaisePendingRequest,
        handleAcceptRequest,
        handleRespondToRequest,
        handleDismissRequest,
        handleRuleOnPointOfOrderRequest,
        handleConvertRequestToMotion,
        handleDivisionOfAssembly,
        handleWithdrawMotion,
        handleTakeFromTable,
        handleReconsider,
        handleResumeFromRecess,
        handleResumeFromSuspendedRules,
        handleSuspendedVote,
        handleNewSpeakingList,
        handleResumePreviousSpeakingList,
        handleDeclareNoSecond,
        handleSetQuorum,
        handleChairAcceptMotion,
        handleChairRejectMotion,
        handleRecognizePendingMotion,
        handleDismissPendingMotion,
        handleReformulateMotion,
        handleOrdersOfTheDay,
        handleOrdersOfTheDayResponse
    };
}

// ========== HELPERS ==========

function getMotionById(stack, id) {
    return stack.find(m => m.id === id) || null;
}

/**
 * Migrate old state format (currentMotion) to new format (motionStack)
 */
function migrateState(state) {
    if (!state) return INITIAL_MEETING_STATE;

    // Already has motionStack? Return as-is with defaults
    if (state.motionStack) {
        return {
            ...INITIAL_MEETING_STATE,
            ...state
        };
    }

    // Migrate from old format
    const migrated = {
        ...INITIAL_MEETING_STATE,
        ...state,
        motionStack: [],
        pendingRequests: state.pendingRequests || [],
        tabledMotions: state.tabledMotions || [],
        decidedMotions: state.decidedMotions || [],
        savedSpeakingState: state.savedSpeakingState || {}
    };

    // If there was a currentMotion, convert it to a stack entry
    if (state.currentMotion && !state.currentMotion.isMinutesCorrectionVote) {
        const entry = createMotionEntry(
            MOTION_TYPES.MAIN,
            state.currentMotion.text,
            state.currentMotion.mover
        );
        if (!entry.error) {
            if (state.currentMotion.seconder) {
                entry.seconder = state.currentMotion.seconder;
                entry.status = MOTION_STATUS.DEBATING;
            }
            migrated.motionStack = [entry];
        }
    }

    // Migrate pendingPointOfOrder to pendingRequests
    if (state.pendingPointOfOrder) {
        const request = createRequest(
            MOTION_TYPES.POINT_OF_ORDER,
            state.pendingPointOfOrder.raisedBy,
            state.pendingPointOfOrder.concern
        );
        if (!request.error) {
            migrated.pendingRequests.push(request);
        }
    }

    return migrated;
}
