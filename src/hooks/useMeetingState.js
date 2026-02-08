import { useState } from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import { MOTION_TYPES, MOTION_STATUS, MOTION_CATEGORY } from '../constants/motionTypes';
import * as MeetingConnection from '../services/MeetingConnection';
import { createMotionEntry, pushMotion, popMotion, getCurrentPendingQuestion, getMainMotion, determineVoteResult, updateTopMotion, updateMotionById } from '../engine/motionStack';
import { getRules, getDisplayName } from '../engine/motionRules';
import { createRequest, acceptRequest, respondToRequest, dismissRequest, cleanupRequests } from '../engine/pendingRequests';
import { isDebateAllowed } from '../engine/debateEngine';
import { handleDivision } from '../engine/voteEngine';

const INITIAL_MEETING_STATE = {
    stage: MEETING_STAGES.NOT_STARTED,
    participants: [],
    motionStack: [],
    pendingRequests: [],
    savedSpeakingState: {},
    tabledMotions: [],
    decidedMotions: [],
    speakingQueue: [],
    speakingHistory: [],
    currentSpeaker: null,
    votes: { aye: 0, nay: 0, abstain: 0 },
    votedBy: [],
    log: [],
    quorum: 0,
    rollCallStatus: {},
    pendingAmendments: [],
    minutesCorrections: [],
    lastChairRuling: null,

    // Legacy compat - kept for minutes correction flow
    currentMotion: null
};

export function useMeetingState() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [meetingState, setMeetingState] = useState(INITIAL_MEETING_STATE);

    const addToLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = [...meetingState.log, { timestamp, message }];
        return newLog;
    };

    const updateMeetingState = (updates) => {
        const newState = { ...meetingState, ...updates };
        setMeetingState(newState);
        MeetingConnection.broadcast(newState);
    };

    // ========== LOGIN / MEETING SETUP ==========

    const handleLogin = (userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);

        const existingState = MeetingConnection.getState();

        if (userData.role === ROLES.PRESIDENT) {
            if (existingState && existingState.stage !== MEETING_STAGES.ADJOURNED) {
                const hasActivePresident = existingState.participants.some(p => {
                    if (p.role !== ROLES.PRESIDENT) return false;
                    if (!p.lastSeen) return true;
                    return (Date.now() - p.lastSeen) < 10000;
                });

                if (hasActivePresident) {
                    alert('A meeting is already in progress with an active President. Please join as a participant or wait for it to end.');
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    return;
                }
            }

            const userWithTimestamp = { ...userData, lastSeen: Date.now() };
            const initialState = {
                ...INITIAL_MEETING_STATE,
                stage: MEETING_STAGES.CALL_TO_ORDER,
                participants: [userWithTimestamp],
                log: [{
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Meeting created by ${userData.name}`
                }],
                meetingCode: userData.meetingCode
            };
            setMeetingState(initialState);
            MeetingConnection.broadcast(initialState);
        } else {
            if (!existingState) {
                alert('No active meeting found. Please wait for the President to start the meeting.');
                setIsLoggedIn(false);
                setCurrentUser(null);
                return;
            }

            // Migrate old state format if needed
            const migratedState = migrateState(existingState);

            const alreadyJoined = migratedState.participants.some(p => p.name === userData.name);

            if (alreadyJoined) {
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
                MeetingConnection.broadcast(newState);
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
        const quorum = meetingState.participants.length;

        const newLog = [...meetingState.log, {
            timestamp: new Date().toLocaleTimeString(),
            message: `Roll call complete. ${totalPresent} of ${quorum} members present. Quorum established.`
        }];

        updateMeetingState({
            stage: MEETING_STAGES.APPROVE_MINUTES,
            quorum,
            log: newLog
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
            console.error(error);
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

        updateMeetingState({
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
        });
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
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The motion "${top.text}" falls for lack of a second.`
            }]
        });
    };

    const handleMoveSubsidiary = (motionType, text, metadata = {}) => {
        const top = getCurrentPendingQuestion(meetingState.motionStack);
        if (!top) return;

        // For amendments, determine degree
        if (motionType === MOTION_TYPES.AMEND) {
            const currentDegree = top.motionType === MOTION_TYPES.AMEND ? top.degree : 0;
            metadata.degree = currentDegree + 1;
            metadata.appliedTo = top.id;
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

        const rules = getRules(motionType);

        // Save speaking state for the current motion before pushing
        const savedSpeakingState = { ...meetingState.savedSpeakingState };
        savedSpeakingState[top.id] = {
            speakingQueue: meetingState.speakingQueue,
            speakingHistory: meetingState.speakingHistory,
            currentSpeaker: meetingState.currentSpeaker
        };

        const updates = {
            motionStack: newStack,
            savedSpeakingState,
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            pendingAmendments: motionType === MOTION_TYPES.AMEND
                ? meetingState.pendingAmendments
                : meetingState.pendingAmendments,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `${currentUser.name} moves: ${rules.displayName} - "${text}"`
            }]
        };

        // Non-debatable motions that don't need a second go straight to voting
        if (!rules.requiresSecond && !rules.isDebatable) {
            updates.stage = MEETING_STAGES.VOTING;
        }

        updateMeetingState(updates);
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
            votes: { aye: 0, nay: 0, abstain: 0 },
            votedBy: [],
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `The chair calls the question on: ${top.displayName}. All in favor?`
            }]
        });
    };

    const handleVote = (vote) => {
        const newVotes = { ...meetingState.votes };
        newVotes[vote] = (newVotes[vote] || 0) + 1;

        const votedBy = [...(meetingState.votedBy || []), currentUser.name];

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

        // Use the stack's votes for the result determination
        const entryForResult = { ...top, votes: meetingState.votes, voteRequired: top.voteRequired };
        const { result, description } = determineVoteResult(entryForResult);

        const newLog = [...meetingState.log, {
            timestamp: new Date().toLocaleTimeString(),
            message: `Vote on ${top.displayName}: ${description}`
        }];

        // Handle the effect of adoption/defeat
        handleMotionDisposition(top, result, description, newLog);
    };

    const handleMotionDisposition = (motion, result, description, newLog) => {
        const { newStack, poppedMotion } = popMotion(meetingState.motionStack);
        const finalStatus = result === 'adopted' ? MOTION_STATUS.ADOPTED : MOTION_STATUS.DEFEATED;

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
                    voteRequired: motion.voteRequired
                },
                decidedMotions,
                votes: { aye: 0, nay: 0, abstain: 0 },
                votedBy: [],
                ...restoredSpeaking,
                savedSpeakingState,
                pendingAmendments: [],
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
                // Amend adopted: modify text of the motion it was applied to
                if (motion.metadata?.appliedTo) {
                    const targetId = motion.metadata.appliedTo;
                    const newStack = updateMotionById(currentStack, targetId, {
                        text: `${getMotionById(currentStack, targetId)?.text} [as amended: ${motion.text}]`
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

        const nextSpeaker = meetingState.speakingQueue[0];
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

        updateMeetingState({
            currentSpeaker: null,
            speakingHistory: updatedHistory,
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
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: `Chair rules: ${ruling}. Point of order by ${request.raisedBy} ${ruling === 'sustained' ? 'SUSTAINED' : 'NOT SUSTAINED'}.`
            }]
        });
    };

    const handleConvertRequestToMotion = (requestType, text, metadata = {}) => {
        // Used for Appeal and Suspend Rules - converts to a stack motion
        const entry = createMotionEntry(requestType, text, currentUser.name, metadata);
        if (entry.error) return;

        const { newStack, error } = pushMotion(meetingState.motionStack, entry);
        if (error) return;

        const rules = getRules(requestType);

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
                message: `${currentUser.name} moves: ${rules?.displayName || requestType} - "${text}"`
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
        updateMeetingState({
            speakingQueue: [],
            speakingHistory: [],
            currentSpeaker: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'The chair opens a new speaking list.'
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

        updateMeetingState({
            pendingAnnouncement: null,
            log: [...meetingState.log, {
                timestamp: new Date().toLocaleTimeString(),
                message: 'Chair proceeded to New Business.'
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

    const handleSubmitAmendment = (amendmentText) => {
        // Route through the subsidiary motion system
        handleMoveSubsidiary(MOTION_TYPES.AMEND, amendmentText, {});
    };

    const handleRecognizeAmendment = (amendment) => {
        // Route through the subsidiary motion system
        handleMoveSubsidiary(MOTION_TYPES.AMEND, amendment.text, {
            proposer: amendment.proposer
        });

        // Remove from pending amendments
        updateMeetingState({
            pendingAmendments: (meetingState.pendingAmendments || []).filter(a => a !== amendment)
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
            const vicePresident = meetingState.participants.find(p => p.role === ROLES.VICE_PRESIDENT);

            if (vicePresident) {
                const updatedParticipants = meetingState.participants.filter(p => p.name !== currentUser.name);
                const promotedVP = { ...vicePresident, role: ROLES.PRESIDENT };
                const finalParticipants = updatedParticipants.map(p =>
                    p.name === vicePresident.name ? promotedVP : p
                );

                updateMeetingState({
                    participants: finalParticipants,
                    log: [...meetingState.log, {
                        timestamp: new Date().toLocaleTimeString(),
                        message: `President ${currentUser.name} has left. Vice President ${vicePresident.name} assumes the chair.`
                    }]
                });
            } else {
                const remainingMembers = meetingState.participants.filter(p => p.name !== currentUser.name).length;

                if (remainingMembers === 0) {
                    updateMeetingState({
                        stage: MEETING_STAGES.ADJOURNED,
                        log: [...meetingState.log, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `President ${currentUser.name} has left. No quorum present. Meeting automatically adjourned.`
                        }]
                    });
                } else {
                    updateMeetingState({
                        stage: MEETING_STAGES.ADJOURNED,
                        participants: meetingState.participants.filter(p => p.name !== currentUser.name),
                        log: [...meetingState.log, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `President ${currentUser.name} has left. No authorized person to assume the chair. Meeting automatically adjourned.`
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

        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    const handleClearMeeting = () => {
        if (confirm('Are you sure you want to clear all meeting data? This will end the meeting for all participants.')) {
            MeetingConnection.clearState();
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
        handleDeclareNoSecond
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
