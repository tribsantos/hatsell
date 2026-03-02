import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES, ROLES } from '../constants';
import { MOTION_TYPES, MOTION_CATEGORY } from '../constants/motionTypes';
import { getAvailableMotions } from '../engine/inOrderCheck';
import { isDebateAllowed } from '../engine/debateEngine';
import { getCurrentPendingQuestion } from '../engine/motionStack';
import { getRules } from '../engine/motionRules';

const TOOLTIP_KEYS = {
    [MOTION_TYPES.POSTPONE_INDEFINITELY]: 'tooltip_postpone_indefinitely',
    [MOTION_TYPES.AMEND]: 'tooltip_amend',
    [MOTION_TYPES.COMMIT]: 'tooltip_commit',
    [MOTION_TYPES.POSTPONE_DEFINITELY]: 'tooltip_postpone_definitely',
    [MOTION_TYPES.LIMIT_DEBATE]: 'tooltip_limit_debate',
    [MOTION_TYPES.PREVIOUS_QUESTION]: 'tooltip_previous_question',
    [MOTION_TYPES.LAY_ON_TABLE]: 'tooltip_lay_on_table',
    [MOTION_TYPES.ORDERS_OF_DAY]: 'tooltip_orders_of_day_priv',
    [MOTION_TYPES.QUESTION_OF_PRIVILEGE]: 'tooltip_question_privilege',
    [MOTION_TYPES.RECESS]: 'tooltip_recess',
    [MOTION_TYPES.ADJOURN]: 'tooltip_adjourn_priv',
    [MOTION_TYPES.FIX_TIME_TO_ADJOURN]: 'tooltip_fix_time',
    [MOTION_TYPES.TAKE_FROM_TABLE]: 'tooltip_take_from_table',
    [MOTION_TYPES.RECONSIDER]: 'tooltip_reconsider',
    [MOTION_TYPES.RESCIND]: 'tooltip_rescind',
};

const InterruptBadge = ({ motionType, t }) => {
    const rules = getRules(motionType);
    if (!rules) return null;
    if (!rules.canInterrupt) return null;
    return <span className="interrupts-badge">{t('actions:label_interrupts')}</span>;
};

/**
 * ChairActions: The chair's current decision point - at most 1-2 buttons.
 * Rendered right below ChairGuidance for immediate access.
 */
export function ChairActions({
    meetingState,
    currentUser,
    onCallToOrder,
    onRollCall,
    onStartCountCheck,
    onCloseCountCheck,
    onApproveMinutes,
    onRecognizeSpeaker,
    onFinishSpeaking,
    onCallVote,
    onAdjourn,
    onRecognizeAmendment,
    onDismissAmendment,
    onAcknowledgeAnnouncement,
    onResumeFromRecess,
    onNewSpeakingList,
    onResumePreviousSpeakingList,
    onResumeFromSuspendedRules,
    onSuspendedVote,
    onDeclareNoSecond,
    onChairAcceptMotion,
    onChairRejectMotion,
    onSecondMotion,
    onOrdersOfTheDayResponse,
    onAdoptAgenda,
    onNextAgendaItem
}) {
    const { t } = useTranslation('actions');
    const {
        stage, motionStack = [], currentMotion, speakingQueue, currentSpeaker,
        rollCallStatus, pendingAmendments, pendingRequests = [],
        tabledMotions = [], decidedMotions = [], lastChairRuling
    } = meetingState;

    const [suspendedThreshold, setSuspendedThreshold] = useState('majority');
    const [appealWindowActive, setAppealWindowActive] = useState(false);
    const [appealCountdown, setAppealCountdown] = useState(0);
    const [adjournConfirmArmed, setAdjournConfirmArmed] = useState(false);

    const top = getCurrentPendingQuestion(motionStack);
    const hasPendingPointOfOrder = pendingRequests.some(r => r.type === 'point_of_order' && r.status === 'pending');

    // 5-second appeal window after chair decisions
    useEffect(() => {
        const decisionTime = meetingState.chairDecisionTime;
        if (!decisionTime) {
            setAppealWindowActive(false);
            return;
        }
        const elapsed = Date.now() - decisionTime;
        if (elapsed >= 5000) {
            setAppealWindowActive(false);
            return;
        }
        setAppealWindowActive(true);
        setAppealCountdown(Math.ceil((5000 - elapsed) / 1000));

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = 5000 - (now - decisionTime);
            if (remaining <= 0) {
                setAppealWindowActive(false);
                setAppealCountdown(0);
                clearInterval(interval);
            } else {
                setAppealCountdown(Math.ceil(remaining / 1000));
            }
        }, 250);

        return () => clearInterval(interval);
    }, [meetingState.chairDecisionTime]);

    useEffect(() => {
        if (!adjournConfirmArmed) return;
        const timeout = setTimeout(() => setAdjournConfirmArmed(false), 4000);
        return () => clearTimeout(timeout);
    }, [adjournConfirmArmed]);

    useEffect(() => {
        if (!adjournConfirmArmed) return;
        const canAdjournStage = stage === MEETING_STAGES.NEW_BUSINESS || stage === MEETING_STAGES.AGENDA_ITEM;
        if (!canAdjournStage || motionStack.length > 0 || !!currentMotion) {
            setAdjournConfirmArmed(false);
        }
    }, [adjournConfirmArmed, stage, motionStack.length, currentMotion]);

    const membersToCall = meetingState.participants.filter(p =>
        p.role !== ROLES.PRESIDENT &&
        p.role !== ROLES.VICE_PRESIDENT &&
        p.role !== ROLES.SECRETARY
    );
    const officersPresent = meetingState.participants.filter(p =>
        p.role === ROLES.PRESIDENT ||
        p.role === ROLES.VICE_PRESIDENT ||
        p.role === ROLES.SECRETARY
    ).length;
    const memberPresent = membersToCall.filter((p) => rollCallStatus[p.name] === 'present').length;
    const totalPresent = officersPresent + memberPresent;
    const quorumMet = !!meetingState.quorumRule && totalPresent >= (meetingState.quorum || 0);
    const allResponded = (rollCallStatus && membersToCall.length > 0 &&
        membersToCall.every(p => rollCallStatus[p.name] === 'present')) ||
        (membersToCall.length === 0);
    const canConductRollCall =
        currentUser.role === ROLES.SECRETARY ||
        currentUser.role === ROLES.PRESIDENT ||
        currentUser.role === ROLES.VICE_PRESIDENT;
    const canCompleteRollCall = stage === MEETING_STAGES.ROLL_CALL && (allResponded || quorumMet);
    const countCheckAllowedStages = [
        MEETING_STAGES.AGENDA_ITEM,
        MEETING_STAGES.NEW_BUSINESS,
        MEETING_STAGES.MOTION_DISCUSSION
    ];
    const canRunCountCheck = countCheckAllowedStages.includes(stage);

    const buttons = [];

    // === SUSPENDED RULES MODE ===
    if (stage === MEETING_STAGES.SUSPENDED_RULES) {
        return (
            <div className="action-buttons">
                <button onClick={onNewSpeakingList} data-tooltip={t('tooltip_new_speaking_list')} title={t('tooltip_new_speaking_list')}>{t('button_new_speaking_list')}</button>
                {meetingState.suspendedSpeakingState && (
                    <button onClick={onResumePreviousSpeakingList} className="secondary" data-tooltip={t('tooltip_resume_previous_list')} title={t('tooltip_resume_previous_list')}>
                        {t('button_resume_previous_list')}
                    </button>
                )}
                {speakingQueue.length > 0 && !currentSpeaker && (
                    <button onClick={onRecognizeSpeaker} data-tooltip={t('tooltip_recognize_next')} title={t('tooltip_recognize_next')}>{t('button_recognize_next')}</button>
                )}
                {currentSpeaker && currentSpeaker.participant !== currentUser.name && (
                    <button onClick={onFinishSpeaking} className="secondary" data-tooltip={t('tooltip_speaker_yields')} title={t('tooltip_speaker_yields')}>
                        {t('button_speaker_yields')}
                    </button>
                )}
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <select
                            value={suspendedThreshold}
                            onChange={(e) => setSuspendedThreshold(e.target.value)}
                            style={{
                                flex: 1, padding: '0.5rem', background: 'var(--h-bg-warm)',
                                border: '2px solid var(--h-border-soft)', borderRadius: '3px',
                                color: 'var(--h-fg)', fontSize: '0.9rem'
                            }}
                        >
                            <option value="majority">{t('label_majority')}</option>
                            <option value="two_thirds">{t('label_two_thirds')}</option>
                            <option value="unanimous">{t('label_unanimous')}</option>
                        </select>
                    </div>
                    <button onClick={() => onSuspendedVote(suspendedThreshold)} data-tooltip={t('tooltip_call_vote_suspended')} title={t('tooltip_call_vote_suspended')} style={{ width: '100%' }}>
                        {t('button_call_vote_suspended')}
                    </button>
                </div>
                <button onClick={onResumeFromSuspendedRules} className="danger" data-tooltip={t('tooltip_resume_regular_rules')} title={t('tooltip_resume_regular_rules')}>
                    {t('button_resume_regular_rules')}
                </button>
            </div>
        );
    }

    // Appeal window
    if (appealWindowActive) {
        buttons.push(
            <div key="appeal-window" style={{
                width: '100%', padding: '0.75rem',
                background: 'var(--h-amber-light)', border: '2px solid var(--h-amber)',
                borderRadius: '4px', textAlign: 'center', fontWeight: '700',
                color: 'var(--h-amber)', fontSize: '0.9rem'
            }}>
                {t('appeal_window', { count: appealCountdown })}
            </div>
        );
    }

    // Call to Order
    if (stage === MEETING_STAGES.CALL_TO_ORDER) {
        buttons.push(
            <button key="call-to-order" onClick={onCallToOrder} data-tooltip={t('tooltip_call_to_order')} title={t('tooltip_call_to_order')}>{t('button_call_to_order')}</button>
        );
    }

    // Roll Call
    if (canConductRollCall && canCompleteRollCall) {
        const completeRollCallTooltip = !meetingState.quorumRule
            ? t('tooltip_complete_roll_call_no_quorum')
            : (quorumMet && !allResponded
                ? t('tooltip_complete_roll_call_quorum_ready')
                : t('tooltip_complete_roll_call'));
        buttons.push(
            <button
                key="complete-roll-call"
                onClick={onRollCall}
                data-tooltip={completeRollCallTooltip}
                title={completeRollCallTooltip}
                disabled={!meetingState.quorumRule}
            >
                {t('button_complete_roll_call')}
            </button>
        );
    }

    // Approve Minutes
    if (stage === MEETING_STAGES.APPROVE_MINUTES) {
        buttons.push(
            <button key="approve-minutes" onClick={onApproveMinutes} data-tooltip={t('tooltip_approve_minutes')} title={t('tooltip_approve_minutes')}>{t('button_approve_minutes')}</button>
        );
    }

    // Adopt Agenda
    if (stage === MEETING_STAGES.ADOPT_AGENDA) {
        buttons.push(
            <button key="adopt-agenda" onClick={onAdoptAgenda} data-tooltip={t('tooltip_adopt_agenda')} title={t('tooltip_adopt_agenda')}>{t('button_adopt_agenda')}</button>
        );
    }

    // Next / Conclude Agenda Item
    if (stage === MEETING_STAGES.AGENDA_ITEM && motionStack.length === 0 && !currentMotion) {
        const agendaItems = meetingState.meetingSettings?.agendaItems || [];
        const idx = meetingState.currentAgendaIndex ?? 0;
        const isLast = idx >= agendaItems.length - 1;
        buttons.push(
            <button key="next-agenda" onClick={onNextAgendaItem} data-tooltip={isLast ? t('tooltip_conclude_agenda') : t('tooltip_next_agenda')} title={isLast ? t('tooltip_conclude_agenda') : t('tooltip_next_agenda')}>
                {isLast ? t('button_conclude_agenda') : t('button_next_agenda_item')}
            </button>
        );
    }

    // Recess resume
    if (stage === MEETING_STAGES.RECESS) {
        buttons.push(
            <button key="resume-recess" onClick={onResumeFromRecess} data-tooltip={t('tooltip_resume_recess')} title={t('tooltip_resume_recess')}>{t('button_resume_meeting')}</button>
        );
    }

    // Orders of the Day response
    if (meetingState.ordersOfTheDayDemand && onOrdersOfTheDayResponse) {
        buttons.push(
            <div key="orders-response" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button
                    onClick={() => onOrdersOfTheDayResponse(true)}
                    style={{ flex: 1 }}
                >
                    {t('button_return_orders')}
                </button>
                <button
                    onClick={() => onOrdersOfTheDayResponse(false)}
                    className="secondary"
                    style={{ flex: 1 }}
                >
                    {t('button_move_suspend')}
                </button>
            </div>
        );
    }

    // Accept/Reject pending_chair motion
    if (top?.status === 'pending_chair' && !meetingState.ordersOfTheDayDemand) {
        buttons.push(
            <div key="chair-accept-reject" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={!appealWindowActive ? onChairAcceptMotion : undefined}
                        disabled={appealWindowActive}
                        data-tooltip={appealWindowActive ? t('tooltip_appeal_wait') : t('tooltip_recognize_motion')}
                        title={appealWindowActive ? t('tooltip_appeal_wait') : t('tooltip_recognize_motion')}
                        style={{ flex: 1, ...(appealWindowActive ? { opacity: 0.45 } : {}) }}
                    >
                        {t('button_recognize_motion')}
                    </button>
                    <button
                        onClick={!appealWindowActive ? onChairRejectMotion : undefined}
                        disabled={appealWindowActive}
                        className="danger"
                        data-tooltip={appealWindowActive ? t('tooltip_appeal_wait') : t('tooltip_reject_motion')}
                        title={appealWindowActive ? t('tooltip_appeal_wait') : t('tooltip_reject_motion')}
                        style={{ flex: 1, ...(appealWindowActive ? { opacity: 0.45 } : {}) }}
                    >
                        {t('button_rule_out_of_order')}
                    </button>
                </div>
            </div>
        );
    }

    // Chair confirm second / declare no second
    if (top?.status === 'pending_second') {
        buttons.push(
            <button key="confirm-second" onClick={onSecondMotion} className="secondary" data-tooltip={t('tooltip_confirm_second')} title={t('tooltip_confirm_second')}>
                {t('button_confirm_second')}
            </button>
        );
        buttons.push(
            <button key="no-second" onClick={onDeclareNoSecond} className="danger" data-tooltip={t('tooltip_no_second')} title={t('tooltip_no_second')}>
                {t('button_no_second')}
            </button>
        );
    }

    // Speaker Yields (chair can end speaker's time)
    if (currentSpeaker && currentSpeaker.participant !== currentUser.name) {
        buttons.push(
            <button key="speaker-yields" onClick={onFinishSpeaking} className="secondary" data-tooltip={t('tooltip_speaker_yields')} title={t('tooltip_speaker_yields')}>
                {t('button_speaker_yields')}
            </button>
        );
    }

    // Call the Vote (only when no speakers waiting)
    if (stage === MEETING_STAGES.MOTION_DISCUSSION && !currentSpeaker &&
        !(pendingAmendments && pendingAmendments.length > 0) &&
        (meetingState.pendingMotions || []).length === 0 && !hasPendingPointOfOrder &&
        !meetingState.ordersOfTheDayDemand) {
        const showCallVote = top?.status !== 'pending_chair' && top?.status !== 'pending_second' && speakingQueue.length === 0;
        if (showCallVote) {
            buttons.push(
                <button
                    key="call-vote"
                    onClick={!appealWindowActive ? onCallVote : undefined}
                    disabled={appealWindowActive}
                    data-tooltip={t('tooltip_call_vote')}
                    title={t('tooltip_call_vote')}
                    style={appealWindowActive ? { opacity: 0.45 } : {}}
                >
                    {t('button_call_vote')}
                </button>
            );
        }
    }

    // Adjourn (no business pending)
    if ((stage === MEETING_STAGES.NEW_BUSINESS || stage === MEETING_STAGES.AGENDA_ITEM) && motionStack.length === 0 && !currentMotion) {
        buttons.push(
            <button
                key="adjourn"
                onClick={() => {
                    if (!adjournConfirmArmed) {
                        setAdjournConfirmArmed(true);
                        return;
                    }
                    setAdjournConfirmArmed(false);
                    onAdjourn();
                }}
                className="danger"
                data-tooltip={adjournConfirmArmed ? t('tooltip_adjourn_confirm') : t('tooltip_adjourn')}
                title={adjournConfirmArmed ? t('tooltip_adjourn_confirm') : t('tooltip_adjourn')}
            >
                {adjournConfirmArmed ? t('button_adjourn_confirm') : t('button_adjourn')}
            </button>
        );
    }

    // Count check (chair-triggered attendance confirmation)
    if (canRunCountCheck) {
        if (meetingState.countCheck) {
            buttons.push(
                <button
                    key="close-count-check"
                    onClick={onCloseCountCheck}
                    className="secondary"
                    data-tooltip={t('tooltip_close_count_check')}
                    title={t('tooltip_close_count_check')}
                >
                    {t('button_close_count_check')}
                </button>
            );
        } else {
            buttons.push(
                <button
                    key="start-count-check"
                    onClick={onStartCountCheck}
                    className="secondary"
                    data-tooltip={t('tooltip_start_count_check')}
                    title={t('tooltip_start_count_check')}
                >
                    {t('button_start_count_check')}
                </button>
            );
        }
    }

    if (buttons.length === 0) return null;

    return (
        <div className="action-buttons">
            {buttons}
        </div>
    );
}

/**
 * MemberActions: All member-facing buttons.
 */
export function MemberActions({
    meetingState,
    currentUser,
    isChair,
    onNewMotion,
    onSecondMotion,
    onRequestToSpeak,
    onFinishSpeaking,
    onAmendMotion,
    onPointOfOrder,
    onIncidentalMainMotion,
    onSubsidiaryMotion,
    onPrivilegedMotion,
    onBringBackMotion,
    onUnlistedMotion,
    onParliamentaryInquiry,
    onRequestForInfo,
    onAppeal,
    onDivideQuestion,
    onObjectionToConsideration,
    onSuspendRules,
    onWithdrawMotion,
    onDivision,
    onPreChairWithdraw
}) {
    const { t } = useTranslation(['actions', 'motions']);
    const {
        stage, motionStack = [], currentMotion, speakingQueue, currentSpeaker,
        pendingAmendments, pendingRequests = [],
        tabledMotions = [], decidedMotions = [], lastChairRuling
    } = meetingState;

    const top = getCurrentPendingQuestion(motionStack);
    const debateAllowed = isDebateAllowed(motionStack);

    const hasPendingPointOfOrder = pendingRequests.some(r => r.type === 'point_of_order' && r.status === 'pending');

    const available = getAvailableMotions(motionStack, stage, currentUser, {
        hasPendingPointOfOrder,
        tabledMotions,
        decidedMotions,
        isChair,
        lastChairRuling,
        speakingHistory: meetingState.speakingHistory || [],
        expertMotionsEnabled: false
    });

    const pendingMotionsList = meetingState.pendingMotions || [];
    const highestPendingPrecedence = pendingMotionsList.reduce((max, pm) => {
        const metadataPrec = pm.metadata?.expertProcedure?.precedence;
        const rulePrec = getRules(pm.motionType)?.precedence;
        const pmPrec = typeof metadataPrec === 'number' ? metadataPrec : rulePrec;
        return pmPrec !== null && pmPrec !== undefined && pmPrec > max ? pmPrec : max;
    }, 0);

    const subsidiaryMotions = available.filter(m =>
        m.category === MOTION_CATEGORY.SUBSIDIARY
    ).map(m => {
        if (currentSpeaker && highestPendingPrecedence > 0) {
            const mRules = getRules(m.motionType);
            if (mRules && mRules.precedence !== null && mRules.precedence <= highestPendingPrecedence) {
                return { ...m, enabled: false, reason: t('higher_priority_pending') };
            }
        }
        return m;
    });
    const privilegedMotions = available.filter(m =>
        m.category === MOTION_CATEGORY.PRIVILEGED
    );
    const bringBackMotions = available.filter(m =>
        m.category === MOTION_CATEGORY.BRING_BACK
    );
    const getMotionTooltip = (m) => {
        const key = TOOLTIP_KEYS[m.motionType];
        const base = key ? t(key) : '';
        if (!m.enabled && m.reason) return `${base} — ${t('out_of_order_reason', { reason: m.reason })}`;
        if (!m.enabled) return `${base} — ${t('out_of_order')}`;
        return base;
    };

    const disabledStyle = { opacity: 0.45 };

    // === SUSPENDED RULES MODE — member actions ===
    if (stage === MEETING_STAGES.SUSPENDED_RULES) {
        return (
            <div className="action-buttons">
                {!speakingQueue.find(s => s.participant === currentUser.name) && (
                    <>
                        <button onClick={() => onRequestToSpeak('pro')} className="speak-btn-favor" data-tooltip={t('tooltip_speak_favor')} title={t('tooltip_speak_favor')}>
                            {t('button_speak_favor')}
                        </button>
                        <button onClick={() => onRequestToSpeak('con')} className="speak-btn-against" data-tooltip={t('tooltip_speak_against')} title={t('tooltip_speak_against')}>
                            {t('button_speak_against')}
                        </button>
                    </>
                )}
                {currentSpeaker && currentSpeaker.participant === currentUser.name && (
                    <button onClick={onFinishSpeaking} className="secondary" data-tooltip={t('tooltip_yield_floor')} title={t('tooltip_yield_floor')}>
                        {t('button_yield_floor')}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="action-buttons">
            {/* === NEW BUSINESS AREA === */}
            {(stage === MEETING_STAGES.NEW_BUSINESS || stage === MEETING_STAGES.AGENDA_ITEM) && motionStack.length === 0 && !currentMotion && (
                <>
                    <div style={{display: 'flex', gap: '0.75rem', width: '100%'}}>
                        <button onClick={onNewMotion} data-tooltip={t('tooltip_original_motion')} title={t('tooltip_original_motion')} style={{flex: 1}}>{t('button_original_motion')}</button>
                        <button onClick={onIncidentalMainMotion} className="secondary" data-tooltip={t('tooltip_incidental_main')} title={t('tooltip_incidental_main')} style={{flex: 1}}>{t('button_incidental')}</button>
                    </div>

                    {bringBackMotions.length > 0 && (
                        <div className="action-section" style={{ width: '100%' }}>
                            <details>
                                <summary>{t('summary_bring_back', { count: bringBackMotions.length })}</summary>
                                <div className="action-grid">
                                    {bringBackMotions.map(m => (
                                        <button
                                            key={m.motionType}
                                            onClick={() => m.enabled && onBringBackMotion(m.motionType)}
                                            className="secondary"
                                            disabled={!m.enabled}
                                            data-tooltip={getMotionTooltip(m)}
                                            title={getMotionTooltip(m)}
                                            style={{fontSize: '0.85rem', padding: '0.5rem', ...(!m.enabled ? disabledStyle : {})}}
                                        >
                                            {t(`motions:display_${m.motionType}`)}<InterruptBadge motionType={m.motionType} t={t} />
                                        </button>
                                    ))}
                                </div>
                            </details>
                        </div>
                    )}

                </>
            )}

            {/* Mover free withdraw/reformulate (before chair accepts) */}
            {top?.status === 'pending_chair' && top?.mover === currentUser.name && !isChair && (
                <button onClick={onPreChairWithdraw} className="secondary" data-tooltip={t('tooltip_pre_chair_withdraw')} title={t('tooltip_pre_chair_withdraw')}>
                    {t('button_withdraw_reformulate')}
                </button>
            )}

            {/* === UNIVERSAL SECOND BUTTON === */}
            {top?.status === 'pending_second' && currentUser.name !== top.mover && (
                <button onClick={onSecondMotion} data-tooltip={t('tooltip_second_motion')} title={t('tooltip_second_motion')}>
                    {t('button_second', { motion: top.displayName || t('button_second_default') })}
                </button>
            )}

            {/* Speak buttons (only when debate is allowed) */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && debateAllowed && !hasPendingPointOfOrder &&
             !speakingQueue.find(s => s.participant === currentUser.name) && (
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button onClick={() => onRequestToSpeak('pro')} className="speak-btn-favor" data-tooltip={t('tooltip_speak_favor')} title={t('tooltip_speak_favor')} style={{ flex: 1 }}>
                        {t('button_speak_favor')}
                    </button>
                    <button onClick={() => onRequestToSpeak('con')} className="speak-btn-against" data-tooltip={t('tooltip_speak_against')} title={t('tooltip_speak_against')} style={{ flex: 1 }}>
                        {t('button_speak_against')}
                    </button>
                </div>
            )}

            {/* Propose Amendment */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && !hasPendingPointOfOrder && (() => {
                const amendMotion = available.find(m => m.motionType === MOTION_TYPES.AMEND);
                let amendEnabled = amendMotion?.enabled ?? false;
                let amendReason = amendMotion?.reason || '';
                if (amendEnabled && currentSpeaker && highestPendingPrecedence >= 2) {
                    amendEnabled = false;
                    amendReason = t('higher_priority_pending');
                }
                const amendTooltip = !amendEnabled
                    ? t('tooltip_propose_amendment_disabled', { reason: amendReason })
                    : t('tooltip_propose_amendment');
                return (
                    <button
                        onClick={amendEnabled ? onAmendMotion : undefined}
                        className="secondary"
                        disabled={!amendEnabled}
                        data-tooltip={amendTooltip}
                        title={amendTooltip}
                        style={!amendEnabled ? disabledStyle : {}}
                    >
                        {t('button_propose_amendment')}
                    </button>
                );
            })()}

            {/* === BOTTOM ACTIONS === */}
            {(() => {
                const appealAvail = available.find(m => m.motionType === MOTION_TYPES.APPEAL);
                const appealEnabled = appealAvail?.enabled ?? false;
                const divisionAvail = available.find(m => m.motionType === MOTION_TYPES.DIVISION_OF_ASSEMBLY);
                const divisionEnabled = divisionAvail?.enabled ?? false;
                const divideQuestionAvail = available.find(m => m.motionType === MOTION_TYPES.DIVISION_OF_QUESTION);
                const divideQuestionEnabled = divideQuestionAvail?.enabled ?? false;
                const objectionAvail = available.find(m => m.motionType === MOTION_TYPES.OBJECTION_TO_CONSIDERATION);
                const objectionEnabled = objectionAvail?.enabled ?? false;

                const subsidiarySection = stage === MEETING_STAGES.MOTION_DISCUSSION && subsidiaryMotions.length > 0 && !hasPendingPointOfOrder && (
                    <div className="action-section" style={{ width: '100%' }}>
                        <details>
                            <summary>{t('summary_subsidiary', { count: subsidiaryMotions.filter(m => m.motionType !== MOTION_TYPES.AMEND).length })}</summary>
                            <div className="action-grid">
                                {subsidiaryMotions.filter(m => m.motionType !== MOTION_TYPES.AMEND).map(m => (
                                    <button
                                        key={m.motionType}
                                        onClick={() => m.enabled && onSubsidiaryMotion(m.motionType)}
                                        className="secondary"
                                        disabled={!m.enabled}
                                        data-tooltip={getMotionTooltip(m)}
                                        title={getMotionTooltip(m)}
                                        style={{fontSize: '0.85rem', padding: '0.5rem', ...(!m.enabled ? disabledStyle : {})}}
                                    >
                                        {t(`motions:display_${m.motionType}`)}<InterruptBadge motionType={m.motionType} t={t} />
                                    </button>
                                ))}
                            </div>
                        </details>
                    </div>
                );

                const privilegedSection = (stage === MEETING_STAGES.MOTION_DISCUSSION || stage === MEETING_STAGES.NEW_BUSINESS ||
                    stage === MEETING_STAGES.AGENDA_ITEM || stage === MEETING_STAGES.VOTING) && privilegedMotions.length > 0 && (
                    <div className="action-section" style={{ width: '100%' }}>
                        <details>
                            <summary>{t('summary_privileged', { count: privilegedMotions.length })}</summary>
                            <div className="action-grid">
                                {privilegedMotions.map(m => (
                                    <button
                                        key={m.motionType}
                                        onClick={() => m.enabled && onPrivilegedMotion(m.motionType)}
                                        className="secondary"
                                        disabled={!m.enabled}
                                        data-tooltip={getMotionTooltip(m)}
                                        title={getMotionTooltip(m)}
                                        style={{fontSize: '0.85rem', padding: '0.5rem', ...(!m.enabled ? disabledStyle : {})}}
                                    >
                                        {t(`motions:display_${m.motionType}`)}<InterruptBadge motionType={m.motionType} t={t} />
                                    </button>
                                ))}
                            </div>
                        </details>
                    </div>
                );

                const incidentalButtons = stage !== MEETING_STAGES.ADJOURNED && stage !== MEETING_STAGES.NOT_STARTED && (
                    <div className="action-section" style={{ width: '100%' }}>
                        <details>
                            <summary>{t('summary_incidental')}</summary>
                            <div className="action-grid">
                                <button
                                    onClick={!hasPendingPointOfOrder ? onPointOfOrder : undefined}
                                    className="secondary"
                                    disabled={hasPendingPointOfOrder}
                                    data-tooltip={hasPendingPointOfOrder ? t('tooltip_point_of_order_pending') : t('tooltip_point_of_order')}
                                    title={hasPendingPointOfOrder ? t('tooltip_point_of_order_pending') : t('tooltip_point_of_order')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem', ...(hasPendingPointOfOrder ? disabledStyle : {})}}
                                >
                                    {t('button_point_of_order')}
                                </button>
                                <button
                                    onClick={onParliamentaryInquiry}
                                    className="secondary"
                                    data-tooltip={t('tooltip_parl_inquiry')} title={t('tooltip_parl_inquiry')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem'}}
                                >
                                    {t('button_parl_inquiry')}
                                </button>
                                <button
                                    onClick={onRequestForInfo}
                                    className="secondary"
                                    data-tooltip={t('tooltip_request_info')} title={t('tooltip_request_info')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem'}}
                                >
                                    {t('button_request_info')}
                                </button>
                                <button
                                    onClick={appealEnabled ? onAppeal : undefined}
                                    className="secondary"
                                    disabled={!appealEnabled}
                                    data-tooltip={!appealEnabled ? t('tooltip_appeal_disabled') : t('tooltip_appeal_enabled')}
                                    title={!appealEnabled ? t('tooltip_appeal_disabled') : t('tooltip_appeal_enabled')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem', ...(!appealEnabled ? disabledStyle : {})}}
                                >
                                    {t('button_appeal_chair')}
                                </button>
                                <button
                                    onClick={divisionEnabled ? onDivision : undefined}
                                    className="secondary"
                                    disabled={!divisionEnabled}
                                    data-tooltip={!divisionEnabled ? t('tooltip_division_disabled') : t('tooltip_division_enabled')}
                                    title={!divisionEnabled ? t('tooltip_division_disabled') : t('tooltip_division_enabled')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem', ...(!divisionEnabled ? disabledStyle : {})}}
                                >
                                    {t('button_division')}
                                </button>
                                <button
                                    onClick={divideQuestionEnabled ? onDivideQuestion : undefined}
                                    className="secondary"
                                    disabled={!divideQuestionEnabled}
                                    data-tooltip={divideQuestionEnabled ? t('tooltip_divide_question_enabled') : t('tooltip_divide_question_disabled')}
                                    title={divideQuestionEnabled ? t('tooltip_divide_question_enabled') : t('tooltip_divide_question_disabled')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem', ...(!divideQuestionEnabled ? disabledStyle : {})}}
                                >
                                    {t('button_divide_question')}
                                </button>
                                <button
                                    onClick={objectionEnabled ? onObjectionToConsideration : undefined}
                                    className="secondary"
                                    disabled={!objectionEnabled}
                                    data-tooltip={objectionEnabled ? t('tooltip_objection_consideration_enabled') : t('tooltip_objection_consideration_disabled')}
                                    title={objectionEnabled ? t('tooltip_objection_consideration_enabled') : t('tooltip_objection_consideration_disabled')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem', ...(!objectionEnabled ? disabledStyle : {})}}
                                >
                                    {t('button_objection_consideration')}
                                </button>
                                <button
                                    onClick={onSuspendRules}
                                    className="secondary"
                                    data-tooltip={t('tooltip_suspend_rules')} title={t('tooltip_suspend_rules')}
                                    style={{fontSize: '0.85rem', padding: '0.5rem'}}
                                >
                                    {t('button_suspend_rules')}
                                </button>
                                {motionStack.length > 0 && top?.mover === currentUser.name && top?.status !== 'pending_chair' && (
                                    <button
                                        onClick={onWithdrawMotion}
                                        className="secondary"
                                        data-tooltip={t('tooltip_withdraw_motion')} title={t('tooltip_withdraw_motion')}
                                        style={{fontSize: '0.85rem', padding: '0.5rem'}}
                                    >
                                        {t('button_withdraw_motion')}
                                    </button>
                                )}
                            </div>
                        </details>
                    </div>
                );
                return (
                    <>
                        {subsidiarySection}
                        {privilegedSection}
                        {incidentalButtons}
                    </>
                );
            })()}
        </div>
    );
}

// Default export for backward compatibility
export default function ActionButtons(props) {
    return (
        <>
            <ChairActions {...props} />
            <MemberActions {...props} />
        </>
    );
}
