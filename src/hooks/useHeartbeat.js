import { useEffect, useRef } from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import * as MeetingConnection from '../services/MeetingConnection';

export function useHeartbeat(currentUser, isLoggedIn, meetingState, setMeetingState, updateMeetingState, options = {}) {
    const prevParticipantNames = useRef(null);
    const meetingStateRef = useRef(meetingState);
    const updateMeetingStateRef = useRef(updateMeetingState);
    const currentUserRef = useRef(currentUser);
    const isLoggedInRef = useRef(isLoggedIn);
    const onInactivityWarningRef = useRef(options.onInactivityWarning);
    const inactivityWarningActiveRef = useRef(options.inactivityWarningActive);

    // Keep refs current without re-running the effect
    meetingStateRef.current = meetingState;
    updateMeetingStateRef.current = updateMeetingState;
    currentUserRef.current = currentUser;
    isLoggedInRef.current = isLoggedIn;
    onInactivityWarningRef.current = options.onInactivityWarning;
    inactivityWarningActiveRef.current = options.inactivityWarningActive;

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = MeetingConnection.subscribe((newState) => {
            // Detect participant join/leave for floating notifications
            if (prevParticipantNames.current !== null) {
                const prevNames = prevParticipantNames.current;
                const newNames = new Set((newState.participants || []).map(p => p.name));
                const notifications = [...(newState.notifications || [])];

                for (const name of newNames) {
                    if (!prevNames.has(name) && name !== currentUserRef.current.name) {
                        notifications.push({ type: 'join', name, timestamp: Date.now() });
                    }
                }
                for (const name of prevNames) {
                    if (!newNames.has(name) && name !== currentUserRef.current.name) {
                        notifications.push({ type: 'leave', name, timestamp: Date.now() });
                    }
                }

                if (notifications.length !== (newState.notifications || []).length) {
                    newState = { ...newState, notifications };
                }

                prevParticipantNames.current = newNames;
            } else {
                prevParticipantNames.current = new Set((newState.participants || []).map(p => p.name));
            }

            // Update our own ref immediately so the heartbeat interval
            // doesn't read stale participants and overwrite a recent join
            meetingStateRef.current = newState;
            setMeetingState(newState);
        });

        const heartbeatInterval = setInterval(() => {
            const ms = meetingStateRef.current;
            const cu = currentUserRef.current;
            if (!isLoggedInRef.current || !cu) return;

            const now = Date.now();

            // --- STEP 1: Update our lastSeen via PARTIAL Firebase update ---
            // This only modifies our entry's lastSeen field in Firebase,
            // preserving all other participants and state. Prevents the race
            // condition where a full broadcast could overwrite a concurrent join.
            const myIndex = ms.participants.findIndex(p => p.name === cu.name);
            if (myIndex >= 0) {
                MeetingConnection.updateParticipantLastSeen(myIndex, now);
            }

            // Update local state only (no full broadcast)
            const updatedParticipants = ms.participants.map(p =>
                p.name === cu.name ? { ...p, lastSeen: now } : p
            );
            const localUpdate = { ...ms, participants: updatedParticipants };
            meetingStateRef.current = localUpdate;
            setMeetingState(localUpdate);

            // --- STEP 2: Prune inactive participants ---
            // Only broadcast the full state when actually removing someone.
            // 45s timeout accounts for browser background-tab throttling
            // (browsers reduce setInterval to ~60s in background tabs)
            const activeParticipants = updatedParticipants.filter(p => {
                if (!p.lastSeen) return true;
                return (now - p.lastSeen) < 45000;
            });

            const hadPresident = ms.participants.some(p => p.role === ROLES.PRESIDENT);
            const hasPresident = activeParticipants.some(p => p.role === ROLES.PRESIDENT);

            if (hadPresident && !hasPresident && ms.stage !== MEETING_STAGES.ADJOURNED) {
                const viceChair = activeParticipants.find(p => p.role === ROLES.VICE_PRESIDENT);

                if (viceChair && cu.name === viceChair.name) {
                    const promoted = { ...viceChair, role: ROLES.PRESIDENT, lastSeen: now };
                    const finalParticipants = activeParticipants.map(p =>
                        p.name === viceChair.name ? promoted : p
                    );

                    updateMeetingStateRef.current({
                        participants: finalParticipants,
                        log: [...ms.log, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `Chair has disconnected. Vice Chair ${viceChair.name} assumes the chair.`
                        }]
                    });
                } else if (!viceChair) {
                    if (activeParticipants.length === 0) {
                        updateMeetingStateRef.current({
                            stage: MEETING_STAGES.ADJOURNED,
                            participants: activeParticipants,
                            log: [...ms.log, {
                                timestamp: new Date().toLocaleTimeString(),
                                message: 'Chair has disconnected. No members remain. Meeting automatically adjourned.'
                            }]
                        });
                    } else {
                        // Only the alphabetically-first participant handles promotion to avoid races
                        const handler = [...activeParticipants].sort((a, b) => a.name.localeCompare(b.name))[0];
                        if (cu.name === handler.name) {
                            const newChair = activeParticipants[Math.floor(Math.random() * activeParticipants.length)];
                            const finalParticipants = activeParticipants.map(p =>
                                p.name === newChair.name ? { ...p, role: ROLES.PRESIDENT, lastSeen: now } : p
                            );

                            updateMeetingStateRef.current({
                                participants: finalParticipants,
                                log: [...ms.log, {
                                    timestamp: new Date().toLocaleTimeString(),
                                    message: `Chair has disconnected. ${newChair.name} has been randomly selected as Chair.`
                                }]
                            });
                        }
                    }
                }
            } else if (activeParticipants.length !== ms.participants.length) {
                const removedParticipants = ms.participants.filter(p =>
                    !activeParticipants.find(ap => ap.name === p.name)
                );

                if (removedParticipants.length > 0 && cu.role === ROLES.PRESIDENT) {
                    const newLog = [...ms.log];
                    removedParticipants.forEach(p => {
                        newLog.push({
                            timestamp: new Date().toLocaleTimeString(),
                            message: `${p.name} has disconnected.`
                        });
                    });

                    const updates = {
                        participants: activeParticipants,
                        log: newLog
                    };

                    // Check if quorum is lost after removing participants
                    const pastRollCall = ms.stage !== MEETING_STAGES.NOT_STARTED &&
                        ms.stage !== MEETING_STAGES.CALL_TO_ORDER &&
                        ms.stage !== MEETING_STAGES.ROLL_CALL &&
                        ms.stage !== MEETING_STAGES.ADJOURNED;

                    if (pastRollCall && ms.quorum > 0 && activeParticipants.length < ms.quorum) {
                        updates.stage = MEETING_STAGES.ADJOURNED;
                        updates.log = [...newLog, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `Quorum lost (${activeParticipants.length} of ${ms.quorum} required). Meeting automatically adjourned.`
                        }];
                    }

                    updateMeetingStateRef.current(updates);
                }
            }

            // --- STEP 3: Inactivity check (chair only) ---
            const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
            const GRACE_PERIOD = 60 * 1000; // 60 seconds after warning

            if (cu.role === ROLES.PRESIDENT &&
                ms.stage !== MEETING_STAGES.ADJOURNED &&
                ms.stage !== MEETING_STAGES.NOT_STARTED &&
                ms.lastActivityTime) {
                const elapsed = now - ms.lastActivityTime;

                if (elapsed > INACTIVITY_TIMEOUT + GRACE_PERIOD) {
                    // Grace period expired — auto-adjourn
                    updateMeetingStateRef.current({
                        stage: MEETING_STAGES.ADJOURNED,
                        log: [...ms.log, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: 'Meeting auto-adjourned due to 30 minutes of inactivity.'
                        }]
                    });
                    if (onInactivityWarningRef.current) {
                        onInactivityWarningRef.current('hide');
                    }
                } else if (elapsed > INACTIVITY_TIMEOUT && !inactivityWarningActiveRef.current) {
                    // Show warning
                    if (onInactivityWarningRef.current) {
                        onInactivityWarningRef.current('show');
                    }
                }
            }
        }, 3000);

        return () => {
            unsubscribe();
            clearInterval(heartbeatInterval);
        };
    }, [currentUser, isLoggedIn]);
}
