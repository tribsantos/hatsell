import { useEffect, useRef } from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import * as MeetingConnection from '../services/MeetingConnection';

export function useHeartbeat(currentUser, isLoggedIn, meetingState, setMeetingState, updateMeetingState) {
    const prevParticipantNames = useRef(null);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = MeetingConnection.subscribe((newState) => {
            // Detect participant join/leave for floating notifications
            if (prevParticipantNames.current !== null) {
                const prevNames = prevParticipantNames.current;
                const newNames = new Set((newState.participants || []).map(p => p.name));
                const notifications = [...(newState.notifications || [])];

                for (const name of newNames) {
                    if (!prevNames.has(name) && name !== currentUser.name) {
                        notifications.push({ type: 'join', name, timestamp: Date.now() });
                    }
                }
                for (const name of prevNames) {
                    if (!newNames.has(name) && name !== currentUser.name) {
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

            setMeetingState(newState);
        });

        const heartbeatInterval = setInterval(() => {
            if (isLoggedIn && currentUser) {
                const now = Date.now();
                const updatedParticipants = meetingState.participants.map(p =>
                    p.name === currentUser.name ? { ...p, lastSeen: now } : p
                );

                const activeParticipants = updatedParticipants.filter(p => {
                    if (!p.lastSeen) return true;
                    return (now - p.lastSeen) < 10000;
                });

                const hadPresident = meetingState.participants.some(p => p.role === ROLES.PRESIDENT);
                const hasPresident = activeParticipants.some(p => p.role === ROLES.PRESIDENT);

                if (hadPresident && !hasPresident && meetingState.stage !== MEETING_STAGES.ADJOURNED) {
                    const viceChair = activeParticipants.find(p => p.role === ROLES.VICE_PRESIDENT);

                    if (viceChair && currentUser.name === viceChair.name) {
                        const promoted = { ...viceChair, role: ROLES.PRESIDENT, lastSeen: now };
                        const finalParticipants = activeParticipants.map(p =>
                            p.name === viceChair.name ? promoted : p
                        );

                        updateMeetingState({
                            participants: finalParticipants,
                            log: [...meetingState.log, {
                                timestamp: new Date().toLocaleTimeString(),
                                message: `Chair has disconnected. Vice Chair ${viceChair.name} assumes the chair.`
                            }]
                        });
                    } else if (!viceChair) {
                        if (activeParticipants.length === 0) {
                            updateMeetingState({
                                stage: MEETING_STAGES.ADJOURNED,
                                participants: activeParticipants,
                                log: [...meetingState.log, {
                                    timestamp: new Date().toLocaleTimeString(),
                                    message: 'Chair has disconnected. No members remain. Meeting automatically adjourned.'
                                }]
                            });
                        } else {
                            // Only the alphabetically-first participant handles promotion to avoid races
                            const handler = [...activeParticipants].sort((a, b) => a.name.localeCompare(b.name))[0];
                            if (currentUser.name === handler.name) {
                                const newChair = activeParticipants[Math.floor(Math.random() * activeParticipants.length)];
                                const finalParticipants = activeParticipants.map(p =>
                                    p.name === newChair.name ? { ...p, role: ROLES.PRESIDENT, lastSeen: now } : p
                                );

                                updateMeetingState({
                                    participants: finalParticipants,
                                    log: [...meetingState.log, {
                                        timestamp: new Date().toLocaleTimeString(),
                                        message: `Chair has disconnected. ${newChair.name} has been randomly selected as Chair.`
                                    }]
                                });
                            }
                        }
                    }
                } else if (activeParticipants.length !== meetingState.participants.length) {
                    const removedParticipants = meetingState.participants.filter(p =>
                        !activeParticipants.find(ap => ap.name === p.name)
                    );

                    if (removedParticipants.length > 0 && currentUser.role === ROLES.PRESIDENT) {
                        const newLog = [...meetingState.log];
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
                        const pastRollCall = meetingState.stage !== MEETING_STAGES.NOT_STARTED &&
                            meetingState.stage !== MEETING_STAGES.CALL_TO_ORDER &&
                            meetingState.stage !== MEETING_STAGES.ROLL_CALL &&
                            meetingState.stage !== MEETING_STAGES.ADJOURNED;

                        if (pastRollCall && meetingState.quorum > 0 && activeParticipants.length < meetingState.quorum) {
                            updates.stage = MEETING_STAGES.ADJOURNED;
                            updates.log = [...newLog, {
                                timestamp: new Date().toLocaleTimeString(),
                                message: `Quorum lost (${activeParticipants.length} of ${meetingState.quorum} required). Meeting automatically adjourned.`
                            }];
                        }

                        updateMeetingState(updates);
                    }
                }
            }
        }, 3000);

        return () => {
            unsubscribe();
            clearInterval(heartbeatInterval);
        };
    }, [currentUser, isLoggedIn, meetingState]);
}
