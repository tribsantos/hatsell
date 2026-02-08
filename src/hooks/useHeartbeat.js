import { useEffect } from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import * as MeetingConnection from '../services/MeetingConnection';

export function useHeartbeat(currentUser, isLoggedIn, meetingState, setMeetingState, updateMeetingState) {
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = MeetingConnection.subscribe((newState) => {
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
                    const vicePresident = activeParticipants.find(p => p.role === ROLES.VICE_PRESIDENT);

                    if (vicePresident && currentUser.name === vicePresident.name) {
                        const promotedVP = { ...vicePresident, role: ROLES.PRESIDENT, lastSeen: now };
                        const finalParticipants = activeParticipants.map(p =>
                            p.name === vicePresident.name ? promotedVP : p
                        );

                        updateMeetingState({
                            participants: finalParticipants,
                            log: [...meetingState.log, {
                                timestamp: new Date().toLocaleTimeString(),
                                message: `President has disconnected. Vice President ${vicePresident.name} assumes the chair.`
                            }]
                        });
                    } else if (!vicePresident) {
                        updateMeetingState({
                            stage: MEETING_STAGES.ADJOURNED,
                            participants: activeParticipants,
                            log: [...meetingState.log, {
                                timestamp: new Date().toLocaleTimeString(),
                                message: 'President has disconnected. No quorum or authorized chair. Meeting automatically adjourned.'
                            }]
                        });
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

                        updateMeetingState({
                            participants: activeParticipants,
                            log: newLog
                        });
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
