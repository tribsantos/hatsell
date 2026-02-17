import { useEffect, useRef } from 'react';
import { MEETING_STAGES } from '../constants';
import { MOTION_STATUS } from '../constants/motionTypes';
import * as audio from '../services/audioCues';

/**
 * Watches meetingState transitions and plays audio cues when enabled.
 * Runs as a passive observer — no state mutations.
 */
export function useAudioCues(meetingState) {
    const prev = useRef({});

    useEffect(() => {
        if (!meetingState.meetingSettings?.audioCues) return;

        const p = prev.current;
        const top = meetingState.motionStack?.length > 0
            ? meetingState.motionStack[meetingState.motionStack.length - 1]
            : null;
        const prevTop = p.motionStack?.length > 0
            ? p.motionStack[p.motionStack.length - 1]
            : null;

        // Voting opened
        if (meetingState.stage === MEETING_STAGES.VOTING && p.stage !== MEETING_STAGES.VOTING) {
            audio.cueVotingOpened();
        }

        // Motion seconded (transition from PENDING_SECOND to DEBATING or VOTING)
        if (top && prevTop && top.id === prevTop.id &&
            prevTop.status === MOTION_STATUS.PENDING_SECOND &&
            (top.status === MOTION_STATUS.DEBATING || top.status === MOTION_STATUS.VOTING)) {
            audio.cueMotionSeconded();
        }

        // Speaking time expired
        if (meetingState.currentSpeaker && meetingState.orgProfile?.timePerSpeech) {
            const elapsed = (Date.now() - meetingState.currentSpeaker.speakingStartTime) / 1000;
            const limit = meetingState.orgProfile.timePerSpeech * 60;
            if (elapsed >= limit && !p._timeExpiredFired) {
                audio.cueTimeExpired();
                prev.current._timeExpiredFired = true;
            }
        }
        if (!meetingState.currentSpeaker) {
            prev.current._timeExpiredFired = false;
        }

        // Result announced (pendingAnnouncement appeared)
        if (meetingState.pendingAnnouncement && !p.pendingAnnouncement) {
            audio.cueResultAnnounced();
        }

        // Meeting adjourned
        if (meetingState.stage === MEETING_STAGES.ADJOURNED && p.stage && p.stage !== MEETING_STAGES.ADJOURNED) {
            audio.cueAdjourned();
        }

        // New motion on stack
        if (top && (!prevTop || top.id !== prevTop.id) && p.stage) {
            audio.cueNewMotion();
        }

        prev.current = { ...meetingState };
    }, [meetingState]);
}
