import React from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import { getCurrentPendingQuestion } from '../engine/motionStack';
import { getThresholdLabel } from '../engine/voteEngine';

export default function ChairGuidance({ meetingState, currentUser, isChair, onAcknowledgeAnnouncement }) {
    if (!isChair) return null;

    const { stage, currentMotion, speakingQueue, currentSpeaker, pendingAmendments, motionStack = [] } = meetingState;
    const top = getCurrentPendingQuestion(motionStack);

    let guidance = null;

    if (stage === MEETING_STAGES.CALL_TO_ORDER) {
        guidance = {
            title: "Call to Order",
            phrase: "The meeting will come to order.",
            action: "Click 'Call Meeting to Order' when ready."
        };
    } else if (stage === MEETING_STAGES.ROLL_CALL) {
        guidance = {
            title: "Roll Call",
            phrase: "The Secretary will call the roll.",
            action: currentUser.role === ROLES.SECRETARY
                ? "Call each member's name. They will respond 'Present.'"
                : "The Secretary is conducting roll call."
        };
    } else if (stage === MEETING_STAGES.APPROVE_MINUTES) {
        if (meetingState.minutesCorrections && meetingState.minutesCorrections.length > 0) {
            guidance = {
                title: "Minutes Corrections",
                phrase: "A correction to the minutes has been proposed. Is there any objection?",
                action: "If no objection, minutes are corrected by consent. If objection, debate and vote on the correction."
            };
        } else {
            guidance = {
                title: "Approval of Minutes",
                phrase: "Are there any corrections to the minutes?",
                action: "[Pause for corrections] If none: 'Hearing none, the minutes stand approved as distributed.'"
            };
        }
    } else if (stage === MEETING_STAGES.NEW_BUSINESS) {
        if (meetingState.pendingAnnouncement) {
            const { motionText, aye, nay, result, description, displayName, voteRequired } = meetingState.pendingAnnouncement;
            const thresholdLabel = voteRequired ? getThresholdLabel(voteRequired) : 'Majority';
            guidance = {
                title: "Announce the Result",
                phrase: description || `The vote is ${aye} ayes, ${nay} nays. The motion ${result}.`,
                action: `${thresholdLabel} required. Announce the result to the assembly, then click 'Proceed to New Business'.`,
                buttonLabel: "Proceed to New Business"
            };
        } else if (top && top.status === 'pending_second') {
            guidance = {
                title: `${top.displayName} Awaiting Second`,
                phrase: `It has been moved: ${top.text}. Is there a second?`,
                action: `Wait for a member to second. ${top.requiresSecond ? 'A second is required.' : ''}`
            };
        } else if (currentMotion && currentMotion.needsSecond) {
            guidance = {
                title: "Motion Awaiting Second",
                phrase: `It has been moved that ${currentMotion.text}. Is there a second?`,
                action: "Wait for a member to second the motion."
            };
        } else if (!currentMotion && motionStack.length === 0) {
            guidance = {
                title: "New Business",
                phrase: "Is there any new business?",
                action: "Wait for members to make motions, or adjourn if business is complete."
            };
        }
    } else if (stage === MEETING_STAGES.MOTION_DISCUSSION) {
        if (top && top.status === 'pending_second') {
            guidance = {
                title: `${top.displayName} Awaiting Second`,
                phrase: `It has been moved: "${top.text}". Is there a second?`,
                action: "Wait for a member to second."
            };
        } else if (pendingAmendments && pendingAmendments.length > 0) {
            guidance = {
                title: "Pending Amendment",
                phrase: `The chair recognizes ${pendingAmendments[0].proposer} to propose an amendment.`,
                action: "Click 'Recognize Amendment' to hear the amendment, or 'Decline' to proceed with debate."
            };
        } else if (currentSpeaker) {
            guidance = {
                title: "Member Speaking",
                phrase: `The chair has recognized ${currentSpeaker.participant}.`,
                action: "Allow the member to speak. When finished, they will yield the floor."
            };
        } else if (speakingQueue.length > 0) {
            guidance = {
                title: "Recognize Next Speaker",
                phrase: `The chair recognizes ${speakingQueue[0].participant}.`,
                action: "Click 'Recognize Next Speaker' to give them the floor."
            };
        } else if (top && !top.isDebatable) {
            guidance = {
                title: `${top.displayName} - Not Debatable`,
                phrase: `The question is on ${top.displayName}: "${top.text}".`,
                action: `This motion is not debatable. ${getThresholdLabel(top.voteRequired)} required. Call the question to vote.`
            };
        } else {
            const questionText = top
                ? `Are you ready for the question on ${top.displayName}?`
                : "Are there any further speakers?";
            guidance = {
                title: "Ready for the Question",
                phrase: `Are there any further speakers? [Pause] Hearing none, ${questionText}`,
                action: top
                    ? `If no one requests to speak, call the question. ${getThresholdLabel(top.voteRequired)} required to adopt.`
                    : "If no one requests to speak, click 'Call the Question (Vote)' to proceed to voting."
            };
        }
    } else if (stage === MEETING_STAGES.VOTING) {
        const motionText = top ? top.text : (currentMotion?.text || '');
        const motionName = top ? top.displayName : 'Motion';
        const thresholdLabel = top ? getThresholdLabel(top.voteRequired) : 'Majority';
        const totalVotes = (meetingState.votes.aye || 0) + (meetingState.votes.nay || 0) + (meetingState.votes.abstain || 0);
        const allVoted = totalVotes >= meetingState.participants.length;

        if (!allVoted) {
            guidance = {
                title: `Vote on ${motionName}`,
                phrase: `The question is on ${motionName}: "${motionText}". All in favor, say aye. [Pause] All opposed, say no.`,
                action: `${thresholdLabel} required. Abstentions do not count. Wait for all members to vote, then click 'Announce Result'.`
            };
        } else {
            guidance = {
                title: "Announce Result",
                phrase: "All votes have been cast.",
                action: `${thresholdLabel} required. Click 'Announce Result' to declare the outcome.`
            };
        }
    } else if (stage === MEETING_STAGES.RECESS) {
        const recessEnd = meetingState.recessEnd;
        const remaining = recessEnd ? Math.max(0, Math.ceil((recessEnd - Date.now()) / 60000)) : '?';
        guidance = {
            title: "Meeting in Recess",
            phrase: `The meeting is in recess. Approximately ${remaining} minutes remaining.`,
            action: "Click 'Resume Meeting' when the recess period has ended."
        };
    } else if (stage === MEETING_STAGES.ADJOURNED) {
        guidance = {
            title: "Meeting Adjourned",
            phrase: "The meeting is adjourned.",
            action: "The meeting has concluded."
        };
    }

    if (!guidance) return null;

    return (
        <div className="info-box" style={{
            marginBottom: '2rem',
            background: 'rgba(192, 57, 43, 0.08)',
            borderLeft: '4px solid #c0392b'
        }}>
            <h4 style={{color: '#7b2d3b', marginBottom: '0.75rem', fontSize: '1.1rem'}}>
                Chair Guidance: {guidance.title}
            </h4>
            <p style={{
                fontSize: '1.05rem',
                fontStyle: 'italic',
                marginBottom: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(192, 57, 43, 0.06)',
                borderRadius: '4px'
            }}>
                "{guidance.phrase}"
            </p>
            <p style={{fontSize: '0.9rem', color: '#444'}}>
                {guidance.action}
            </p>
            {guidance.buttonLabel && onAcknowledgeAnnouncement && (
                <button onClick={onAcknowledgeAnnouncement} style={{marginTop: '1rem', width: '100%'}}>
                    {guidance.buttonLabel}
                </button>
            )}
        </div>
    );
}
