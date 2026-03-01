import React from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES, ROLES } from '../constants';
import { getCurrentPendingQuestion, getMainMotion } from '../engine/motionStack';
import { getThresholdLabel } from '../engine/voteEngine';
import { getRules } from '../engine/motionRules';

export default function ChairGuidance({ meetingState, currentUser, isChair, onAcknowledgeAnnouncement }) {
    const { t } = useTranslation('guidance');

    if (!isChair) return null;

    const { stage, currentMotion, speakingQueue, currentSpeaker, pendingAmendments, motionStack = [] } = meetingState;
    const top = getCurrentPendingQuestion(motionStack);
    const mainMotion = getMainMotion(motionStack);
    const pendingMotions = meetingState.pendingMotions || [];

    let guidance = null;

    if (meetingState.pendingAnnouncement) {
        const { motionText, aye, nay, result, description, displayName, voteRequired, voteDetails } = meetingState.pendingAnnouncement;
        const thresholdLabel = voteRequired ? getThresholdLabel(voteRequired) : 'Majority';
        const isAmendment = displayName && displayName.toLowerCase().includes('amend');
        const hasMoreBusiness = motionStack.length > 0;
        const showDetails = meetingState.meetingSettings?.showVoteDetails && voteDetails && voteDetails.length > 0;
        const buttonLabel = hasMoreBusiness ? t('button_continue_debate') : t('button_proceed_new_business');

        if (result === 'adopted') {
            if (isAmendment) {
                const mainText = mainMotion?.text || motionText;
                guidance = {
                    title: t('title_announce_result'),
                    phrase: t('phrase_adopted_amendment', { text: mainText }),
                    action: t('action_vote_count', { aye, nay, threshold: thresholdLabel }),
                    buttonLabel
                };
            } else {
                guidance = {
                    title: t('title_announce_result'),
                    phrase: hasMoreBusiness
                        ? t('phrase_adopted_more', { motionName: displayName || 'motion' })
                        : t('phrase_adopted_final', { text: motionText }),
                    action: t('action_vote_count', { aye, nay, threshold: thresholdLabel }),
                    buttonLabel
                };
            }
        } else {
            if (isAmendment) {
                const mainText = mainMotion?.text || motionText;
                guidance = {
                    title: t('title_announce_result'),
                    phrase: t('phrase_defeated_amendment', { text: mainText }),
                    action: t('action_vote_count', { aye, nay, threshold: thresholdLabel }),
                    buttonLabel
                };
            } else {
                guidance = {
                    title: t('title_announce_result'),
                    phrase: hasMoreBusiness
                        ? t('phrase_defeated_more', { motionName: displayName || 'motion' })
                        : t('phrase_defeated_final'),
                    action: t('action_vote_count', { aye, nay, threshold: thresholdLabel }),
                    buttonLabel
                };
            }
        }

        if (showDetails) {
            guidance.voteDetails = voteDetails;
        }
    } else if (stage === MEETING_STAGES.CALL_TO_ORDER) {
        guidance = {
            title: t('title_call_to_order'),
            phrase: t('phrase_call_to_order'),
            action: t('action_call_to_order')
        };
    } else if (stage === MEETING_STAGES.ROLL_CALL) {
        guidance = {
            title: t('title_roll_call'),
            phrase: t('phrase_roll_call'),
            action: currentUser.role === ROLES.SECRETARY
                ? t('action_roll_call_secretary')
                : t('action_roll_call_chair')
        };
    } else if (stage === MEETING_STAGES.APPROVE_MINUTES) {
        if (meetingState.minutesCorrections && meetingState.minutesCorrections.length > 0 && meetingState.minutesCorrections[0].status === 'pending_chair') {
            guidance = {
                title: t('title_review_correction'),
                phrase: t('phrase_review_correction'),
                action: t('action_review_correction')
            };
        } else if (meetingState.minutesCorrections && meetingState.minutesCorrections.length > 0) {
            guidance = {
                title: t('title_minutes_corrections'),
                phrase: t('phrase_minutes_correction'),
                action: t('action_minutes_correction')
            };
        } else {
            guidance = {
                title: t('title_approval_of_minutes'),
                phrase: t('phrase_minutes_no_corrections'),
                action: t('action_minutes_no_corrections')
            };
        }
    } else if (stage === MEETING_STAGES.ADOPT_AGENDA) {
        const agendaItems = meetingState.meetingSettings?.agendaItems || [];
        guidance = {
            title: t('title_adopt_agenda'),
            phrase: t('phrase_adopt_agenda', { count: agendaItems.length, plural: agendaItems.length !== 1 ? 's' : '' }),
            action: t('action_adopt_agenda')
        };
    } else if (stage === MEETING_STAGES.AGENDA_ITEM) {
        const agendaItems = meetingState.meetingSettings?.agendaItems || [];
        const idx = meetingState.currentAgendaIndex ?? 0;
        const item = agendaItems[idx];
        if (item) {
            if (item.category === 'informational_report') {
                guidance = {
                    title: t('title_agenda_item', { index: idx + 1, title: item.title }),
                    phrase: item.owner
                        ? t('phrase_agenda_report', { owner: item.owner, title: item.title })
                        : t('phrase_agenda_report_no_owner', { title: item.title }),
                    action: t('action_agenda_report')
                };
            } else {
                guidance = {
                    title: t('title_agenda_item', { index: idx + 1, title: item.title }),
                    phrase: t('phrase_agenda_motion', { title: item.title }),
                    action: t('action_agenda_motion')
                };
            }
        }
    } else if (stage === MEETING_STAGES.NEW_BUSINESS) {
        if (top && top.status === 'pending_second') {
            guidance = {
                title: t('title_awaiting_second', { motionName: top.displayName }),
                phrase: t('phrase_moved_second', { text: top.text }),
                action: t('action_wait_second_required', { extra: top.requiresSecond ? t('action_second_required') : '' })
            };
        } else if (currentMotion && currentMotion.needsSecond) {
            guidance = {
                title: t('title_motion_awaiting_second'),
                phrase: t('phrase_moved_that_second', { text: currentMotion.text }),
                action: t('action_wait_second_motion')
            };
        } else if (!currentMotion && motionStack.length === 0) {
            guidance = {
                title: t('title_new_business'),
                phrase: t('phrase_new_business'),
                action: t('action_new_business')
            };
        }
    } else if (stage === MEETING_STAGES.MOTION_DISCUSSION) {
        if (meetingState.ordersOfTheDayDemand) {
            guidance = {
                title: t('title_orders_of_the_day'),
                phrase: t('phrase_orders_of_day'),
                action: t('action_orders_of_day')
            };
        } else if (top && top.status === 'pending_chair') {
            guidance = {
                title: t('title_motion_pending_recognition'),
                phrase: t('phrase_motion_pending', { mover: top.mover, text: top.text }),
                action: t('action_recognize_or_reject')
            };
        } else if (top && top.status === 'pending_second') {
            guidance = {
                title: t('title_awaiting_second', { motionName: top.displayName }),
                phrase: t('phrase_moved_second', { text: top.text }),
                action: t('action_wait_second')
            };
        } else if (pendingAmendments && pendingAmendments.length > 0) {
            guidance = {
                title: t('title_pending_amendment'),
                phrase: t('phrase_pending_amendment', { proposer: pendingAmendments[0].proposer }),
                action: t('action_recognize_amendment')
            };
        } else if (currentSpeaker) {
            guidance = {
                title: t('title_member_speaking'),
                phrase: t('phrase_member_speaking', { name: currentSpeaker.participant }),
                action: t('action_member_speaking')
            };
        } else if (pendingMotions.length > 0) {
            const highestPending = [...pendingMotions].sort((a, b) => {
                const aPrec = a.metadata?.expertProcedure?.precedence ?? getRules(a.motionType)?.precedence ?? -Infinity;
                const bPrec = b.metadata?.expertProcedure?.precedence ?? getRules(b.motionType)?.precedence ?? -Infinity;
                return bPrec - aPrec;
            })[0];
            guidance = {
                title: t('title_motion_pending_recognition'),
                phrase: t('phrase_motion_pending', { mover: highestPending.proposer, text: highestPending.text }),
                action: t('action_recognize_or_reject')
            };
        } else if (speakingQueue.length > 0) {
            guidance = {
                title: t('title_recognize_next_speaker'),
                phrase: t('phrase_recognize_next', { name: speakingQueue[0].participant }),
                action: t('action_recognize_next')
            };
        } else if (top && !top.isDebatable) {
            guidance = {
                title: t('title_not_debatable', { motionName: top.displayName }),
                phrase: t('phrase_not_debatable', { motionName: top.displayName, text: top.text }),
                action: t('action_not_debatable', { threshold: getThresholdLabel(top.voteRequired) })
            };
        } else {
            const questionText = top
                ? t('phrase_ready_question_motion', { motionName: top.displayName })
                : t('phrase_ready_question_default');
            guidance = {
                title: t('title_ready_for_question'),
                phrase: t('phrase_ready_question', { question: questionText }),
                action: top
                    ? t('action_ready_question', { threshold: getThresholdLabel(top.voteRequired) })
                    : t('action_ready_question_default')
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
                title: t('title_vote_on', { motionName }),
                phrase: t('phrase_vote', { motionName, text: motionText }),
                action: t('action_vote', { threshold: thresholdLabel })
            };
        } else {
            guidance = {
                title: t('title_announce_result_short'),
                phrase: chairHasVoted ? t('phrase_all_voted') : t('phrase_all_voted_chair'),
                action: t('action_announce_result', { threshold: thresholdLabel })
            };
        }
    } else if (stage === MEETING_STAGES.RECESS) {
        guidance = {
            title: t('title_meeting_in_recess'),
            phrase: t('phrase_recess'),
            action: t('action_recess')
        };
    } else if (stage === MEETING_STAGES.ADJOURNED) {
        guidance = {
            title: t('title_meeting_adjourned'),
            phrase: t('phrase_adjourned'),
            action: t('action_adjourned')
        };
    }

    if (!guidance) return null;

    return (
        <div className="chair-guidance" role="region" aria-live="polite" aria-label="Chair guidance">
            <h4>{t('chair_guidance_label', { title: guidance.title })}</h4>
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
                    <div style={{ fontWeight: '600', marginBottom: '0.35rem', color: 'var(--h-fg-muted)' }}>{t('individual_votes')}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
                        {guidance.voteDetails.map((v, i) => (
                            <span key={i} style={{
                                color: v.vote === 'aye' ? 'var(--h-green)' : v.vote === 'nay' ? 'var(--h-red)' : 'var(--h-fg-dim)'
                            }}>
                                {v.name}: {v.vote === 'aye' ? t('vote_aye') : v.vote === 'nay' ? t('vote_nay') : t('vote_abstain')}
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
