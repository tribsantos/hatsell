import React from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import { getCurrentPendingQuestion, getMainMotion } from '../engine/motionStack';
import { getThresholdLabel } from '../engine/voteEngine';
import { MOTION_TYPES } from '../constants/motionTypes';

export default function ChairGuidance({ meetingState, currentUser, isChair, onAcknowledgeAnnouncement }) {
    if (!isChair) return null;

    const { stage, currentMotion, speakingQueue, currentSpeaker, pendingAmendments, motionStack = [] } = meetingState;
    const top = getCurrentPendingQuestion(motionStack);
    const mainMotion = getMainMotion(motionStack);

    let guidance = null;

    if (meetingState.pendingAnnouncement) {
        const { motionText, aye, nay, result, description, displayName, voteRequired, voteDetails } = meetingState.pendingAnnouncement;
        const thresholdLabel = voteRequired ? getThresholdLabel(voteRequired) : 'Majority';
        const isAmendment = displayName && displayName.toLowerCase().includes('amend');
        const hasMoreBusiness = motionStack.length > 0;
        const showDetails = meetingState.meetingSettings?.showVoteDetails && voteDetails && voteDetails.length > 0;
        const buttonLabel = hasMoreBusiness ? 'Continue Debate' : 'Proceed to New Business';

        if (result === 'adopted') {
            if (isAmendment) {
                const mainText = mainMotion?.text || motionText;
                guidance = {
                    title: "Announce the Result",
                    phrase: `The ayes have it and the amendment is adopted. Discussion continues on the motion as amended: "${mainText}".`,
                    action: `The vote was ${aye} ayes, ${nay} nays. ${thresholdLabel} was required.`,
                    buttonLabel
                };
            } else {
                guidance = {
                    title: "Announce the Result",
                    phrase: hasMoreBusiness
                        ? `The ayes have it and the ${displayName || 'motion'} is adopted. Debate continues on the pending question.`
                        : `The ayes have it and the motion is adopted: "${motionText}". Is there further business?`,
                    action: `The vote was ${aye} ayes, ${nay} nays. ${thresholdLabel} was required.`,
                    buttonLabel
                };
            }
        } else {
            if (isAmendment) {
                const mainText = mainMotion?.text || motionText;
                guidance = {
                    title: "Announce the Result",
                    phrase: `The amendment is lost. Discussion continues on the main motion: "${mainText}".`,
                    action: `The vote was ${aye} ayes, ${nay} nays. ${thresholdLabel} was required.`,
                    buttonLabel
                };
            } else {
                guidance = {
                    title: "Announce the Result",
                    phrase: hasMoreBusiness
                        ? `The nays have it and the ${displayName || 'motion'} is lost. Debate continues on the pending question.`
                        : `The nays have it and the motion is lost. Is there further business?`,
                    action: `The vote was ${aye} ayes, ${nay} nays. ${thresholdLabel} was required.`,
                    buttonLabel
                };
            }
        }

        if (showDetails) {
            guidance.voteDetails = voteDetails;
        }
    } else if (stage === MEETING_STAGES.CALL_TO_ORDER) {
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
                action: "If no objection, the minutes are corrected by unanimous consent. If a member objects, the correction is debated and put to a vote."
            };
        } else {
            guidance = {
                title: "Approval of Minutes",
                phrase: "Are there any corrections to the minutes?",
                action: "Pause for corrections. If none are offered: 'Hearing no corrections, the minutes stand approved as distributed.' If corrections are proposed, handle them before approving."
            };
        }
    } else if (stage === MEETING_STAGES.NEW_BUSINESS) {
        if (top && top.status === 'pending_second') {
            guidance = {
                title: `${top.displayName} Awaiting Second`,
                phrase: `It has been moved: "${top.text}". Is there a second?`,
                action: `Wait for a member to second. ${top.requiresSecond ? 'A second is required.' : ''}`
            };
        } else if (currentMotion && currentMotion.needsSecond) {
            guidance = {
                title: "Motion Awaiting Second",
                phrase: `It has been moved that "${currentMotion.text}". Is there a second?`,
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
        if (meetingState.ordersOfTheDayDemand) {
            guidance = {
                title: "Orders of the Day",
                phrase: "A member has called for the Orders of the Day. The chair must either return to the prescribed order of business or put the question: 'Shall the assembly suspend the rules and continue with the current business?' (requires 2/3 vote)",
                action: "Choose to comply or move to suspend the rules."
            };
        } else if (top && top.status === 'pending_chair') {
            guidance = {
                title: "Motion Pending Recognition",
                phrase: `A motion has been made by ${top.mover}: "${top.text}". Is there a second?`,
                action: "Decide whether to recognize this motion or rule it out of order."
            };
        } else if (top && top.status === 'pending_second') {
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
        const chairHasVoted = (meetingState.votedBy || []).includes(currentUser.name);
        const allVoted = totalVotes >= meetingState.participants.length || (!chairHasVoted && totalVotes >= meetingState.participants.length - 1);

        if (!allVoted) {
            guidance = {
                title: `Vote on ${motionName}`,
                phrase: `The question is on ${motionName}: "${motionText}". All in favor, say aye. [Pause] All opposed, say no.`,
                action: `${thresholdLabel} required. Abstentions do not count. Wait for all members to vote, then click 'Announce Result'.`
            };
        } else {
            guidance = {
                title: "Announce Result",
                phrase: chairHasVoted ? "All votes have been cast." : "All members have voted. The chair may vote or announce the result.",
                action: `${thresholdLabel} required. Click 'Announce Result' to declare the outcome.`
            };
        }
    } else if (stage === MEETING_STAGES.RECESS) {
        guidance = {
            title: "Meeting in Recess",
            phrase: "The meeting is in recess.",
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
        <div className="chair-guidance" role="region" aria-live="polite" aria-label="Chair guidance">
            <h4>Chair Guidance: {guidance.title}</h4>
            <div className="script-text">"{guidance.phrase}"</div>
            <p className="guidance-instruction">{guidance.action}</p>
            {guidance.voteDetails && guidance.voteDetails.length > 0 && (
                <div style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(0,0,0,0.03)',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.35rem', color: '#555' }}>Individual Votes:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
                        {guidance.voteDetails.map((v, i) => (
                            <span key={i} style={{
                                color: v.vote === 'aye' ? '#27ae60' : v.vote === 'nay' ? '#c0392b' : '#888'
                            }}>
                                {v.name}: {v.vote === 'aye' ? 'Aye' : v.vote === 'nay' ? 'Nay' : 'Abstain'}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {guidance.buttonLabel && onAcknowledgeAnnouncement && (
                <button type="button" onClick={onAcknowledgeAnnouncement} style={{ marginTop: '0.75rem', width: '100%' }}>
                    {guidance.buttonLabel}
                </button>
            )}
        </div>
    );
}
