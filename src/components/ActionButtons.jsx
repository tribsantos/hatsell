import React, { useState } from 'react';
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
    return (
        <span style={{
            fontSize: '0.6rem', padding: '0.1rem 0.3rem', marginLeft: '0.25rem',
            background: 'rgba(230, 126, 34, 0.2)', borderRadius: '2px',
            color: '#e67e22', fontWeight: '700', whiteSpace: 'nowrap', verticalAlign: 'middle'
        }}>
            Interrupts
        </span>
    );
};

export default function ActionButtons({
    meetingState,
    currentUser,
    isChair,
    onCallToOrder,
    onRollCall,
    onApproveMinutes,
    onNewMotion,
    onSecondMotion,
    onRequestToSpeak,
    onRecognizeSpeaker,
    onFinishSpeaking,
    onCallVote,
    onAdjourn,
    onAmendMotion,
    onSecondAmendment,
    onRecognizeAmendment,
    onDismissAmendment,
    onPointOfOrder,
    onRuleOnPointOfOrder,
    onIncidentalMainMotion,
    onIncidentalMotions,
    // New handlers
    onSubsidiaryMotion,
    onPrivilegedMotion,
    onBringBackMotion,
    onParliamentaryInquiry,
    onRequestForInfo,
    onAppeal,
    onSuspendRules,
    onWithdrawMotion,
    onDivision,
    onResumeFromRecess,
    onNewSpeakingList,
    onResumePreviousSpeakingList,
    onResumeFromSuspendedRules,
    onSuspendedVote,
    onDeclareNoSecond,
    onChairAcceptMotion,
    onChairRejectMotion,
    onPreChairWithdraw
}) {
    const {
        stage, motionStack = [], currentMotion, speakingQueue, currentSpeaker,
        rollCallStatus, pendingAmendments, pendingRequests = [],
        tabledMotions = [], decidedMotions = [], lastChairRuling
    } = meetingState;

    const [suspendedThreshold, setSuspendedThreshold] = useState('majority');

    const top = getCurrentPendingQuestion(motionStack);
    const debateAllowed = isDebateAllowed(motionStack);

    const membersToCall = meetingState.participants.filter(p =>
        p.role !== ROLES.PRESIDENT &&
        p.role !== ROLES.VICE_PRESIDENT &&
        p.role !== ROLES.SECRETARY
    );
    const allResponded = (rollCallStatus && membersToCall.length > 0 &&
        membersToCall.every(p => rollCallStatus[p.name] === 'present')) ||
        (membersToCall.length === 0);

    const hasPendingPointOfOrder = pendingRequests.some(r => r.type === 'point_of_order' && r.status === 'pending');

    const available = getAvailableMotions(motionStack, stage, currentUser, {
        hasPendingPointOfOrder,
        tabledMotions,
        decidedMotions,
        isChair,
        lastChairRuling
    });

    const isMotionAvailable = (type) => available.some(m => m.motionType === type && m.enabled);

    const subsidiaryMotions = available.filter(m =>
        m.category === MOTION_CATEGORY.SUBSIDIARY
    );
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

    // === SUSPENDED RULES MODE ===
    if (stage === MEETING_STAGES.SUSPENDED_RULES) {
        return (
            <div className="action-buttons">
                {/* New Speaking List (chair only) */}
                {isChair && (
                    <button onClick={onNewSpeakingList} data-tooltip="Start a temporary speaking list (previous list resumes after it ends)">New Speaking List</button>
                )}
                {isChair && meetingState.suspendedSpeakingState && (
                    <button onClick={onResumePreviousSpeakingList} className="secondary" data-tooltip="Resume the previous speaking list">
                        Resume Previous List
                    </button>
                )}

                {/* Speak buttons */}
                {!speakingQueue.find(s => s.participant === currentUser.name) && (
                    <>
                        <button onClick={() => onRequestToSpeak('pro')} data-tooltip="Join the queue to speak in support" style={{background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white'}}>
                            Speak in Favor
                        </button>
                        <button onClick={() => onRequestToSpeak('con')} data-tooltip="Join the queue to speak in opposition" style={{background: 'linear-gradient(135deg, #c0392b 0%, #96281b 100%)', color: 'white'}}>
                            Speak Against
                        </button>
                    </>
                )}

                {/* Recognize Speaker (chair only) */}
                {isChair && speakingQueue.length > 0 && !currentSpeaker && (
                    <button onClick={onRecognizeSpeaker} data-tooltip="Give the floor to the next person in queue">Recognize Next Speaker</button>
                )}

                {/* Yield Floor (speaker) */}
                {currentSpeaker && currentSpeaker.participant === currentUser.name && (
                    <button onClick={onFinishSpeaking} data-tooltip="Finish speaking and return the floor to the chair" style={{background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: '#ffffff', fontWeight: '700'}}>
                        Yield Floor
                    </button>
                )}

                {/* Speaker Yields (chair) */}
                {isChair && currentSpeaker && currentSpeaker.participant !== currentUser.name && (
                    <button onClick={onFinishSpeaking} className="secondary" data-tooltip="End the current speaker's time">
                        Speaker Yields Floor
                    </button>
                )}

                {/* Call Vote with threshold selector (chair only) */}
                {isChair && (
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
                        <button onClick={() => onSuspendedVote(suspendedThreshold)} data-tooltip="Put the matter to a vote with the selected threshold" style={{ width: '100%' }}>
                            Call Vote
                        </button>
                    </div>
                )}

                {/* Resume Regular Rules (chair only) */}
                {isChair && (
                    <button onClick={onResumeFromSuspendedRules} className="danger" data-tooltip="Return to normal parliamentary procedure">
                        Resume Regular Rules
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="action-buttons">
            {/* Call to Order */}
            {isChair && stage === MEETING_STAGES.CALL_TO_ORDER && (
                <button onClick={onCallToOrder} data-tooltip="Officially begin the meeting">Call Meeting to Order</button>
            )}

            {/* Roll Call */}
            {(currentUser.role === ROLES.SECRETARY || isChair) && stage === MEETING_STAGES.ROLL_CALL && allResponded && (
                <button
                    onClick={onRollCall}
                    data-tooltip={meetingState.quorumRule ? "Confirm attendance and establish quorum" : "Set a quorum requirement first (see left panel)"}
                    disabled={!meetingState.quorumRule}
                >
                    Complete Roll Call
                </button>
            )}

            {/* Approve Minutes */}
            {isChair && stage === MEETING_STAGES.APPROVE_MINUTES && (
                <button onClick={onApproveMinutes} data-tooltip="Accept the minutes of the last meeting as correct">Approve Minutes</button>
            )}

            {/* Recess controls */}
            {stage === MEETING_STAGES.RECESS && isChair && (
                <button onClick={onResumeFromRecess} data-tooltip="End the break and continue the meeting">Resume Meeting</button>
            )}

            {/* Recognize Speaker (chair only during debate, not during Point of Order) */}
            {isChair && stage === MEETING_STAGES.MOTION_DISCUSSION && speakingQueue.length > 0 && !currentSpeaker &&
             !(pendingAmendments && pendingAmendments.length > 0) && !hasPendingPointOfOrder && (
                <button onClick={onRecognizeSpeaker} data-tooltip="Give the floor to the next person in queue">
                    Recognize Next Speaker
                </button>
            )}

            {/* Yield Floor (speaker) */}
            {currentSpeaker && currentSpeaker.participant === currentUser.name && (
                <button onClick={onFinishSpeaking} data-tooltip="Finish speaking and return the floor to the chair" style={{background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: '#ffffff', fontWeight: '700'}}>
                    Yield Floor
                </button>
            )}

            {/* Speaker Yields (chair) */}
            {isChair && currentSpeaker && currentSpeaker.participant !== currentUser.name && (
                <button onClick={onFinishSpeaking} className="secondary" data-tooltip="End the current speaker's time">
                    Speaker Yields Floor
                </button>
            )}

            {/* Call the Question (chair) — hide during Point of Order */}
            {isChair && stage === MEETING_STAGES.MOTION_DISCUSSION &&
             !(pendingAmendments && pendingAmendments.length > 0) && !hasPendingPointOfOrder && (
                <button onClick={onCallVote} data-tooltip="End debate and put the motion to a vote">Call the Question (Vote)</button>
            )}

            {/* Adjourn (no business pending) */}
            {isChair && stage === MEETING_STAGES.NEW_BUSINESS && motionStack.length === 0 && !currentMotion && (
                <button onClick={onAdjourn} className="danger" data-tooltip="End the meeting">Adjourn Meeting</button>
            )}

            {/* === NEW BUSINESS AREA === */}
            {stage === MEETING_STAGES.NEW_BUSINESS && motionStack.length === 0 && !currentMotion && (
                <>
                    <div style={{display: 'flex', gap: '0.75rem', width: '100%'}}>
                        <button onClick={onNewMotion} data-tooltip="Propose a new item for the group to consider" style={{flex: 1}}>Original Motion</button>
                        <button onClick={onIncidentalMainMotion} className="secondary" data-tooltip="Propose procedural business (e.g. adopt rules)" style={{flex: 1}}>Incidental</button>
                    </div>

                    {/* Bring-Back Motions */}
                    {bringBackMotions.length > 0 && (
                        <div style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
                            {bringBackMotions.map(m => (
                                <button
                                    key={m.motionType}
                                    onClick={() => m.enabled && onBringBackMotion(m.motionType)}
                                    className="secondary"
                                    disabled={!m.enabled}
                                    data-tooltip={getMotionTooltip(m)}
                                    style={{flex: 1, fontSize: '0.85rem', padding: '0.5rem', ...(!m.enabled ? disabledStyle : {})}}
                                >
                                    {m.displayName}<InterruptBadge motionType={m.motionType} />
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* === CHAIR ACCEPT/REJECT MOTION (pending_chair) === */}
            {isChair && top?.status === 'pending_chair' && (
                <div style={{ width: '100%' }}>
                    <div className="info-box" style={{ marginBottom: '0.75rem' }}>
                        <strong>{top.mover}</strong> moves: "{top.text}"
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={onChairAcceptMotion} data-tooltip="Recognize this motion and open it for a second" style={{ flex: 1 }}>
                            Recognize Motion
                        </button>
                        <button onClick={onChairRejectMotion} className="danger" data-tooltip="Rule this motion out of order" style={{ flex: 1 }}>
                            Rule Out of Order
                        </button>
                    </div>
                </div>
            )}

            {/* Mover free withdraw/reformulate (before chair accepts) */}
            {top?.status === 'pending_chair' && top?.mover === currentUser.name && !isChair && (
                <button onClick={onPreChairWithdraw} className="secondary" data-tooltip="Take back or revise your motion (no vote needed — chair hasn't accepted yet)">
                    Withdraw / Reformulate
                </button>
            )}

            {/* === UNIVERSAL SECOND BUTTON === */}
            {top?.status === 'pending_second' && currentUser.name !== top.mover && (
                <button onClick={onSecondMotion} data-tooltip="Support putting this motion up for discussion">
                    Second: {top.displayName || 'the Motion'}
                </button>
            )}

            {/* === CHAIR CONFIRM SECOND === */}
            {isChair && top?.status === 'pending_second' && (
                <>
                    <button onClick={onSecondMotion} className="secondary" data-tooltip="Confirm someone verbally seconded the motion">
                        Confirm Second (oral)
                    </button>
                    <button onClick={onDeclareNoSecond} className="danger" data-tooltip="Declare no one seconded — the motion dies" style={{ fontSize: '0.85rem' }}>
                        No Second — Motion Falls
                    </button>
                </>
            )}

            {/* Speak buttons (only when debate is allowed, hide during Point of Order - Fix 4) */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && debateAllowed && !hasPendingPointOfOrder &&
             !speakingQueue.find(s => s.participant === currentUser.name) && (
                <>
                    <button onClick={() => onRequestToSpeak('pro')} data-tooltip="Join the queue to speak in support" style={{background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white'}}>
                        Speak in Favor
                    </button>
                    <button onClick={() => onRequestToSpeak('con')} data-tooltip="Join the queue to speak in opposition" style={{background: 'linear-gradient(135deg, #c0392b 0%, #96281b 100%)', color: 'white'}}>
                        Speak Against
                    </button>
                </>
            )}

            {/* Propose Amendment — always visible during MOTION_DISCUSSION, disabled when not in order */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && !hasPendingPointOfOrder && (() => {
                const amendMotion = available.find(m => m.motionType === MOTION_TYPES.AMEND);
                const amendEnabled = amendMotion?.enabled ?? false;
                const amendTooltip = amendMotion && !amendEnabled
                    ? `Change the wording of the motion before voting — OUT OF ORDER: ${amendMotion.reason || ''}`
                    : 'Change the wording of the motion before voting';
                return (
                    <button
                        onClick={amendEnabled ? onAmendMotion : undefined}
                        className="secondary"
                        disabled={!amendEnabled}
                        data-tooltip={amendTooltip}
                        style={!amendEnabled ? disabledStyle : {}}
                    >
                        Propose Amendment
                    </button>
                );
            })()}

            {/* === SUBSIDIARY MOTIONS — hide during Point of Order === */}
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
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(hasPendingPointOfOrder ? disabledStyle : {})}}
                            disabled={hasPendingPointOfOrder}
                        >
                            Point of Order
                        </button>
                        <button
                            onClick={onParliamentaryInquiry}
                            className="secondary"
                            data-tooltip="Ask the chair a question about procedure"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Parl. Inquiry
                        </button>
                        <button
                            onClick={onRequestForInfo}
                            className="secondary"
                            data-tooltip="Ask a factual question relevant to the discussion"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Request Info
                        </button>
                        <button
                            onClick={appealEnabled ? onAppeal : undefined}
                            className="secondary"
                            disabled={!appealEnabled}
                            data-tooltip={!appealEnabled ? 'Challenge the chair\'s ruling — OUT OF ORDER: No recent chair ruling to appeal' : 'Challenge the chair\'s ruling — the group decides'}
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(!appealEnabled ? disabledStyle : {})}}
                        >
                            Appeal Chair
                        </button>
                        <button
                            onClick={divisionEnabled ? onDivision : undefined}
                            className="secondary"
                            disabled={!divisionEnabled}
                            data-tooltip={!divisionEnabled ? 'Request a counted vote — OUT OF ORDER: Division can only be demanded during voting' : 'Request a counted vote instead of a voice vote'}
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem', ...(!divisionEnabled ? disabledStyle : {})}}
                        >
                            Division
                        </button>
                        <button
                            onClick={onSuspendRules}
                            className="secondary"
                            data-tooltip="Temporarily set aside the rules (requires 2/3 vote)"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Suspend Rules
                        </button>
                        {motionStack.length > 0 && top?.mover === currentUser.name && top?.status !== 'pending_chair' && (
                            <button
                                onClick={onWithdrawMotion}
                                className="secondary"
                                data-tooltip="Request to take back your motion (requires consent)"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                Withdraw Motion
                            </button>
                        )}
                    </div>
                </div>
                );
            })()}
        </div>
    );
}
