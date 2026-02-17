import React, { useState, useEffect } from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import { MOTION_TYPES, MOTION_CATEGORY } from '../constants/motionTypes';
import { getAvailableMotions } from '../engine/inOrderCheck';
import { isDebateAllowed } from '../engine/debateEngine';
import { getCurrentPendingQuestion } from '../engine/motionStack';
import { getRules } from '../engine/motionRules';

const MOTION_TYPE_TOOLTIPS = {
    [MOTION_TYPES.POSTPONE_INDEFINITELY]: 'Kill the motion without a direct vote on it',
    [MOTION_TYPES.AMEND]: 'Change the wording of the motion before voting',
    [MOTION_TYPES.COMMIT]: 'Send the motion to a smaller group for study',
    [MOTION_TYPES.POSTPONE_DEFINITELY]: 'Delay the motion to a specific time',
    [MOTION_TYPES.LIMIT_DEBATE]: 'Set a time limit or speaker limit on debate',
    [MOTION_TYPES.PREVIOUS_QUESTION]: 'End debate and vote immediately',
    [MOTION_TYPES.LAY_ON_TABLE]: 'Set aside the motion temporarily for urgent business',
    [MOTION_TYPES.ORDERS_OF_DAY]: 'Require the group to follow the agenda',
    [MOTION_TYPES.QUESTION_OF_PRIVILEGE]: 'Address an urgent matter affecting the assembly',
    [MOTION_TYPES.RECESS]: 'Take a short break',
    [MOTION_TYPES.ADJOURN]: 'End the meeting',
    [MOTION_TYPES.FIX_TIME_TO_ADJOURN]: 'Set when the next meeting will be',
    [MOTION_TYPES.TAKE_FROM_TABLE]: 'Resume a motion that was set aside earlier',
    [MOTION_TYPES.RECONSIDER]: 'Reopen a motion that was already voted on',
    [MOTION_TYPES.RESCIND]: 'Cancel or reverse a previously adopted motion',
};

const InterruptBadge = ({ motionType }) => {
    const rules = getRules(motionType);
    if (!rules) return null;
    if (!rules.canInterrupt) return null;
    return <span className="interrupts-badge">Interrupts</span>;
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
    onOrdersOfTheDayResponse
}) {
    const {
        stage, motionStack = [], currentMotion, speakingQueue, currentSpeaker,
        rollCallStatus, pendingAmendments, pendingRequests = [],
        tabledMotions = [], decidedMotions = [], lastChairRuling
    } = meetingState;

    const [suspendedThreshold, setSuspendedThreshold] = useState('majority');
    const [appealWindowActive, setAppealWindowActive] = useState(false);
    const [appealCountdown, setAppealCountdown] = useState(0);

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

    const membersToCall = meetingState.participants.filter(p =>
        p.role !== ROLES.PRESIDENT &&
        p.role !== ROLES.VICE_PRESIDENT &&
        p.role !== ROLES.SECRETARY
    );
    const allResponded = (rollCallStatus && membersToCall.length > 0 &&
        membersToCall.every(p => rollCallStatus[p.name] === 'present')) ||
        (membersToCall.length === 0);

    const buttons = [];

    // === SUSPENDED RULES MODE ===
    if (stage === MEETING_STAGES.SUSPENDED_RULES) {
        return (
            <div className="action-buttons">
                <button onClick={onNewSpeakingList} data-tooltip="Start a temporary speaking list" title="Start a temporary speaking list">New Speaking List</button>
                {meetingState.suspendedSpeakingState && (
                    <button onClick={onResumePreviousSpeakingList} className="secondary" data-tooltip="Resume the previous speaking list" title="Resume the previous speaking list">
                        Resume Previous List
                    </button>
                )}
                {speakingQueue.length > 0 && !currentSpeaker && (
                    <button onClick={onRecognizeSpeaker} data-tooltip="Give the floor to the next person in queue" title="Give the floor to the next person in queue">Recognize Next Speaker</button>
                )}
                {currentSpeaker && currentSpeaker.participant !== currentUser.name && (
                    <button onClick={onFinishSpeaking} className="secondary" data-tooltip="End the current speaker's time" title="End the current speaker's time">
                        Speaker Yields Floor
                    </button>
                )}
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <select
                            value={suspendedThreshold}
                            onChange={(e) => setSuspendedThreshold(e.target.value)}
                            style={{
                                flex: 1, padding: '0.5rem', background: '#f9f8f5',
                                border: '2px solid #ddd', borderRadius: '3px',
                                color: '#1a1a1a', fontSize: '0.9rem'
                            }}
                        >
                            <option value="majority">Majority</option>
                            <option value="two_thirds">Two-Thirds</option>
                            <option value="unanimous">Unanimous</option>
                        </select>
                    </div>
                    <button onClick={() => onSuspendedVote(suspendedThreshold)} data-tooltip="Put the matter to a vote" title="Put the matter to a vote" style={{ width: '100%' }}>
                        Call Vote
                    </button>
                </div>
                <button onClick={onResumeFromSuspendedRules} className="danger" data-tooltip="Return to normal parliamentary procedure" title="Return to normal parliamentary procedure">
                    Resume Regular Rules
                </button>
            </div>
        );
    }

    // Appeal window
    if (appealWindowActive) {
        buttons.push(
            <div key="appeal-window" style={{
                width: '100%', padding: '0.75rem',
                background: 'rgba(230, 126, 34, 0.12)', border: '2px solid #e67e22',
                borderRadius: '4px', textAlign: 'center', fontWeight: '700',
                color: '#e67e22', fontSize: '0.9rem'
            }}>
                Appeal window ({appealCountdown}s remaining)
            </div>
        );
    }

    // Call to Order
    if (stage === MEETING_STAGES.CALL_TO_ORDER) {
        buttons.push(
            <button key="call-to-order" onClick={onCallToOrder} data-tooltip="Officially begin the meeting" title="Officially begin the meeting">Call Meeting to Order</button>
        );
    }

    // Roll Call
    if ((currentUser.role === ROLES.SECRETARY || true) && stage === MEETING_STAGES.ROLL_CALL && allResponded) {
        buttons.push(
            <button
                key="complete-roll-call"
                onClick={onRollCall}
                data-tooltip={meetingState.quorumRule ? "Confirm attendance and establish quorum" : "Set a quorum requirement first (see left panel)"}
                title={meetingState.quorumRule ? "Confirm attendance and establish quorum" : "Set a quorum requirement first (see left panel)"}
                disabled={!meetingState.quorumRule}
            >
                Complete Roll Call
            </button>
        );
    }

    // Approve Minutes
    if (stage === MEETING_STAGES.APPROVE_MINUTES) {
        buttons.push(
            <button key="approve-minutes" onClick={onApproveMinutes} data-tooltip="Accept the minutes of the last meeting as correct" title="Accept the minutes of the last meeting as correct">Approve Minutes</button>
        );
    }

    // Recess resume
    if (stage === MEETING_STAGES.RECESS) {
        buttons.push(
            <button key="resume-recess" onClick={onResumeFromRecess} data-tooltip="End the break and continue the meeting" title="End the break and continue the meeting">Resume Meeting</button>
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
                    Return to Orders of the Day
                </button>
                <button
                    onClick={() => onOrdersOfTheDayResponse(false)}
                    className="secondary"
                    style={{ flex: 1 }}
                >
                    Move to Suspend the Rules
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
                        data-tooltip={appealWindowActive ? "Wait for appeal window to expire" : "Recognize this motion and open it for a second"}
                        title={appealWindowActive ? "Wait for appeal window to expire" : "Recognize this motion and open it for a second"}
                        style={{ flex: 1, ...(appealWindowActive ? { opacity: 0.45 } : {}) }}
                    >
                        Recognize Motion
                    </button>
                    <button
                        onClick={!appealWindowActive ? onChairRejectMotion : undefined}
                        disabled={appealWindowActive}
                        className="danger"
                        data-tooltip={appealWindowActive ? "Wait for appeal window to expire" : "Rule this motion out of order"}
                        title={appealWindowActive ? "Wait for appeal window to expire" : "Rule this motion out of order"}
                        style={{ flex: 1, ...(appealWindowActive ? { opacity: 0.45 } : {}) }}
                    >
                        Rule Out of Order
                    </button>
                </div>
            </div>
        );
    }

    // Chair confirm second / declare no second
    if (top?.status === 'pending_second') {
        buttons.push(
            <button key="confirm-second" onClick={onSecondMotion} className="secondary" data-tooltip="Confirm someone verbally seconded the motion" title="Confirm someone verbally seconded the motion">
                Confirm Second (oral)
            </button>
        );
        buttons.push(
            <button key="no-second" onClick={onDeclareNoSecond} className="danger" data-tooltip="Declare no one seconded — the motion dies" title="Declare no one seconded — the motion dies">
                No Second — Motion Falls
            </button>
        );
    }

    // Recognize Speaker during debate
    if (stage === MEETING_STAGES.MOTION_DISCUSSION && speakingQueue.length > 0 && !currentSpeaker &&
        !(pendingAmendments && pendingAmendments.length > 0) &&
        (meetingState.pendingMotions || []).length === 0 && !hasPendingPointOfOrder &&
        !meetingState.ordersOfTheDayDemand) {
        buttons.push(
            <button
                key="recognize-speaker"
                onClick={!appealWindowActive ? onRecognizeSpeaker : undefined}
                disabled={appealWindowActive}
                data-tooltip={appealWindowActive ? "Wait for appeal window to expire" : "Give the floor to the next person in queue"}
                title={appealWindowActive ? "Wait for appeal window to expire" : "Give the floor to the next person in queue"}
                style={appealWindowActive ? { opacity: 0.45 } : {}}
            >
                Recognize Next Speaker
            </button>
        );
    }

    // Speaker Yields (chair can end speaker's time)
    if (currentSpeaker && currentSpeaker.participant !== currentUser.name) {
        buttons.push(
            <button key="speaker-yields" onClick={onFinishSpeaking} className="secondary" data-tooltip="End the current speaker's time" title="End the current speaker's time">
                Speaker Yields Floor
            </button>
        );
    }

    // Call the Question (vote) — hide during Point of Order, pending motions, active speaker
    if (stage === MEETING_STAGES.MOTION_DISCUSSION && !currentSpeaker &&
        !(pendingAmendments && pendingAmendments.length > 0) &&
        (meetingState.pendingMotions || []).length === 0 && !hasPendingPointOfOrder &&
        !meetingState.ordersOfTheDayDemand &&
        top?.status !== 'pending_chair' && top?.status !== 'pending_second') {
        buttons.push(
            <button
                key="call-question"
                onClick={!appealWindowActive ? onCallVote : undefined}
                disabled={appealWindowActive}
                data-tooltip={appealWindowActive ? "Wait for appeal window to expire" : "End debate and put the motion to a vote"}
                title={appealWindowActive ? "Wait for appeal window to expire" : "End debate and put the motion to a vote"}
                style={appealWindowActive ? { opacity: 0.45 } : {}}
            >
                Call the Question (Vote)
            </button>
        );
    }

    // Adjourn (no business pending)
    if (stage === MEETING_STAGES.NEW_BUSINESS && motionStack.length === 0 && !currentMotion) {
        buttons.push(
            <button key="adjourn" onClick={() => { if (window.confirm('Are you sure you want to adjourn the meeting?')) onAdjourn(); }} className="danger" data-tooltip="End the meeting" title="End the meeting">Adjourn Meeting</button>
        );
    }

    if (buttons.length === 0) return null;

    return (
        <div className="action-buttons">
            {buttons}
        </div>
    );
}

/**
 * MemberActions: All member-facing buttons (propose motions, second, amendments, subsidiary, privileged, incidental, bring-back).
 * Also includes yield floor for the current speaker.
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
    onParliamentaryInquiry,
    onRequestForInfo,
    onAppeal,
    onSuspendRules,
    onWithdrawMotion,
    onDivision,
    onPreChairWithdraw,
    onOrdersOfTheDay
}) {
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
        speakingHistory: meetingState.speakingHistory || []
    });

    const pendingMotionsList = meetingState.pendingMotions || [];
    const highestPendingPrecedence = pendingMotionsList.reduce((max, pm) => {
        const pmRules = getRules(pm.motionType);
        return pmRules && pmRules.precedence !== null && pmRules.precedence > max ? pmRules.precedence : max;
    }, 0);

    const subsidiaryMotions = available.filter(m =>
        m.category === MOTION_CATEGORY.SUBSIDIARY
    ).map(m => {
        if (currentSpeaker && highestPendingPrecedence > 0) {
            const mRules = getRules(m.motionType);
            if (mRules && mRules.precedence !== null && mRules.precedence <= highestPendingPrecedence) {
                return { ...m, enabled: false, reason: 'A higher or equal priority motion is already pending' };
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
        const base = MOTION_TYPE_TOOLTIPS[m.motionType] || '';
        if (!m.enabled && m.reason) return `${base} — OUT OF ORDER: ${m.reason}`;
        if (!m.enabled) return `${base} — OUT OF ORDER`;
        return base;
    };

    const disabledStyle = { opacity: 0.45 };

    // === SUSPENDED RULES MODE — member actions ===
    if (stage === MEETING_STAGES.SUSPENDED_RULES) {
        return (
            <div className="action-buttons">
                {!speakingQueue.find(s => s.participant === currentUser.name) && (
                    <>
                        <button onClick={() => onRequestToSpeak('pro')} className="success" data-tooltip="Join the queue to speak in support" title="Join the queue to speak in support">
                            Speak in Favor
                        </button>
                        <button onClick={() => onRequestToSpeak('con')} data-tooltip="Join the queue to speak in opposition" title="Join the queue to speak in opposition">
                            Speak Against
                        </button>
                    </>
                )}
                {currentSpeaker && currentSpeaker.participant === currentUser.name && (
                    <button onClick={onFinishSpeaking} className="secondary" data-tooltip="Finish speaking and return the floor to the chair" title="Finish speaking and return the floor to the chair">
                        Yield Floor
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="action-buttons">
            {/* Yield Floor (speaker) */}
            {currentSpeaker && currentSpeaker.participant === currentUser.name && (
                <button onClick={onFinishSpeaking} className="secondary" data-tooltip="Finish speaking and return the floor to the chair" title="Finish speaking and return the floor to the chair">
                    Yield Floor
                </button>
            )}

            {/* === NEW BUSINESS AREA === */}
            {stage === MEETING_STAGES.NEW_BUSINESS && motionStack.length === 0 && !currentMotion && (
                <>
                    <div style={{display: 'flex', gap: '0.75rem', width: '100%'}}>
                        <button onClick={onNewMotion} data-tooltip="Propose a new item for the group to consider" title="Propose a new item for the group to consider" style={{flex: 1}}>Original Motion</button>
                        <button onClick={onIncidentalMainMotion} className="secondary" data-tooltip="Propose procedural business (e.g. adopt rules)" title="Propose procedural business (e.g. adopt rules)" style={{flex: 1}}>Incidental</button>
                    </div>

                    {bringBackMotions.length > 0 && (
                        <div style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
                            {bringBackMotions.map(m => (
                                <button
                                    key={m.motionType}
                                    onClick={() => m.enabled && onBringBackMotion(m.motionType)}
                                    className="secondary"
                                    disabled={!m.enabled}
                                    data-tooltip={getMotionTooltip(m)}
                                    title={getMotionTooltip(m)}
                                    style={{flex: 1, fontSize: '0.85rem', padding: '0.5rem', ...(!m.enabled ? disabledStyle : {})}}
                                >
                                    {m.displayName}<InterruptBadge motionType={m.motionType} />
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Mover free withdraw/reformulate (before chair accepts) */}
            {top?.status === 'pending_chair' && top?.mover === currentUser.name && !isChair && (
                <button onClick={onPreChairWithdraw} className="secondary" data-tooltip="Take back or revise your motion (no vote needed — chair hasn't accepted yet)" title="Take back or revise your motion (no vote needed — chair hasn't accepted yet)">
                    Withdraw / Reformulate
                </button>
            )}

            {/* === UNIVERSAL SECOND BUTTON === */}
            {top?.status === 'pending_second' && currentUser.name !== top.mover && (
                <button onClick={onSecondMotion} data-tooltip="Support putting this motion up for discussion" title="Support putting this motion up for discussion">
                    Second: {top.displayName || 'the Motion'}
                </button>
            )}

            {/* Speak buttons (only when debate is allowed) */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && debateAllowed && !hasPendingPointOfOrder &&
             !speakingQueue.find(s => s.participant === currentUser.name) && (
                <>
                    <button onClick={() => onRequestToSpeak('pro')} className="success" data-tooltip="Join the queue to speak in support" title="Join the queue to speak in support">
                        Speak in Favor
                    </button>
                    <button onClick={() => onRequestToSpeak('con')} data-tooltip="Join the queue to speak in opposition" title="Join the queue to speak in opposition">
                        Speak Against
                    </button>
                </>
            )}

            {/* Propose Amendment */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && !hasPendingPointOfOrder && (() => {
                const amendMotion = available.find(m => m.motionType === MOTION_TYPES.AMEND);
                let amendEnabled = amendMotion?.enabled ?? false;
                let amendReason = amendMotion?.reason || '';
                if (amendEnabled && currentSpeaker && highestPendingPrecedence >= 2) {
                    amendEnabled = false;
                    amendReason = 'A higher or equal priority motion is already pending';
                }
                const amendTooltip = !amendEnabled
                    ? `Change the wording of the motion before voting — OUT OF ORDER: ${amendReason}`
                    : 'Change the wording of the motion before voting';
                return (
                    <button
                        onClick={amendEnabled ? onAmendMotion : undefined}
                        className="secondary"
                        disabled={!amendEnabled}
                        data-tooltip={amendTooltip}
                        title={amendTooltip}
                        style={!amendEnabled ? disabledStyle : {}}
                    >
                        Propose Amendment
                    </button>
                );
            })()}

            {/* === SUBSIDIARY MOTIONS === */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && subsidiaryMotions.length > 0 && !hasPendingPointOfOrder && (
                <div style={{ width: '100%' }}>
                    <div style={{
                        fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                        Subsidiary Motions
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
                        {subsidiaryMotions.filter(m => m.motionType !== MOTION_TYPES.AMEND).map(m => (
                            <button
                                key={m.motionType}
                                onClick={() => m.enabled && onSubsidiaryMotion(m.motionType)}
                                className="secondary"
                                disabled={!m.enabled}
                                data-tooltip={getMotionTooltip(m)}
                                title={getMotionTooltip(m)}
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(!m.enabled ? disabledStyle : {})}}
                            >
                                {m.displayName}<InterruptBadge motionType={m.motionType} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* === PRIVILEGED MOTIONS === */}
            {(stage === MEETING_STAGES.MOTION_DISCUSSION || stage === MEETING_STAGES.NEW_BUSINESS ||
              stage === MEETING_STAGES.VOTING) && privilegedMotions.length > 0 && (
                <div style={{ width: '100%' }}>
                    <div style={{
                        fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                        Privileged Motions
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
                        {privilegedMotions.map(m => (
                            <button
                                key={m.motionType}
                                onClick={() => m.enabled && onPrivilegedMotion(m.motionType)}
                                className="secondary"
                                disabled={!m.enabled}
                                data-tooltip={getMotionTooltip(m)}
                                title={getMotionTooltip(m)}
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(!m.enabled ? disabledStyle : {})}}
                            >
                                {m.displayName}<InterruptBadge motionType={m.motionType} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* === INCIDENTAL MOTIONS === */}
            {stage !== MEETING_STAGES.ADJOURNED && stage !== MEETING_STAGES.NOT_STARTED && (() => {
                const appealAvail = available.find(m => m.motionType === MOTION_TYPES.APPEAL);
                const appealEnabled = appealAvail?.enabled ?? false;
                const divisionAvail = available.find(m => m.motionType === MOTION_TYPES.DIVISION_OF_ASSEMBLY);
                const divisionEnabled = divisionAvail?.enabled ?? false;

                return (
                <div style={{ width: '100%' }}>
                    <div style={{
                        fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                        Incidental Motions
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
                        <button
                            onClick={!hasPendingPointOfOrder ? onPointOfOrder : undefined}
                            className="secondary"
                            data-tooltip={hasPendingPointOfOrder ? 'Alert the chair that a rule is being broken — OUT OF ORDER: A point of order is already pending' : 'Alert the chair that a rule is being broken'}
                            title={hasPendingPointOfOrder ? 'Alert the chair that a rule is being broken — OUT OF ORDER: A point of order is already pending' : 'Alert the chair that a rule is being broken'}
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(hasPendingPointOfOrder ? disabledStyle : {})}}
                            disabled={hasPendingPointOfOrder}
                        >
                            Point of Order
                        </button>
                        <button
                            onClick={onParliamentaryInquiry}
                            className="secondary"
                            data-tooltip="Ask the chair a question about procedure" title="Ask the chair a question about procedure"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Parl. Inquiry
                        </button>
                        <button
                            onClick={onRequestForInfo}
                            className="secondary"
                            data-tooltip="Ask a factual question relevant to the discussion" title="Ask a factual question relevant to the discussion"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Request Info
                        </button>
                        <button
                            onClick={appealEnabled ? onAppeal : undefined}
                            className="secondary"
                            disabled={!appealEnabled}
                            data-tooltip={!appealEnabled ? 'Challenge the chair\'s ruling — OUT OF ORDER: No recent chair ruling to appeal' : 'Challenge the chair\'s ruling — the group decides'}
                            title={!appealEnabled ? 'Challenge the chair\'s ruling — OUT OF ORDER: No recent chair ruling to appeal' : 'Challenge the chair\'s ruling — the group decides'}
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(!appealEnabled ? disabledStyle : {})}}
                        >
                            Appeal Chair
                        </button>
                        <button
                            onClick={divisionEnabled ? onDivision : undefined}
                            className="secondary"
                            disabled={!divisionEnabled}
                            data-tooltip={!divisionEnabled ? 'Request a counted vote — OUT OF ORDER: Division can only be demanded during voting' : 'Request a counted vote instead of a voice vote'}
                            title={!divisionEnabled ? 'Request a counted vote — OUT OF ORDER: Division can only be demanded during voting' : 'Request a counted vote instead of a voice vote'}
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(!divisionEnabled ? disabledStyle : {})}}
                        >
                            Division
                        </button>
                        <button
                            onClick={onSuspendRules}
                            className="secondary"
                            data-tooltip="Temporarily set aside the rules (requires 2/3 vote)" title="Temporarily set aside the rules (requires 2/3 vote)"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Suspend Rules
                        </button>
                        {motionStack.length > 0 && top?.mover === currentUser.name && top?.status !== 'pending_chair' && (
                            <button
                                onClick={onWithdrawMotion}
                                className="secondary"
                                data-tooltip="Request to take back your motion (requires consent)" title="Request to take back your motion (requires consent)"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                Withdraw Motion
                            </button>
                        )}
                        {/* Call for Orders of the Day — available when business appears out of agenda order */}
                        {onOrdersOfTheDay && !isChair && (stage === MEETING_STAGES.MOTION_DISCUSSION || stage === MEETING_STAGES.NEW_BUSINESS) && (
                            <button
                                onClick={onOrdersOfTheDay}
                                className="secondary"
                                data-tooltip="Demand the assembly return to the prescribed order of business" title="Demand the assembly return to the prescribed order of business"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                Orders of the Day
                            </button>
                        )}
                    </div>
                </div>
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
