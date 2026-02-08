import React, { useState } from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import { MOTION_TYPES, MOTION_CATEGORY } from '../constants/motionTypes';
import { getAvailableMotions } from '../engine/inOrderCheck';
import { isDebateAllowed } from '../engine/debateEngine';
import { getCurrentPendingQuestion } from '../engine/motionStack';

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
    onResumeFromSuspendedRules,
    onSuspendedVote,
    onDeclareNoSecond
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
        m.category === MOTION_CATEGORY.SUBSIDIARY && m.enabled
    );
    const privilegedMotions = available.filter(m =>
        m.category === MOTION_CATEGORY.PRIVILEGED && m.enabled
    );
    const bringBackMotions = available.filter(m =>
        m.category === MOTION_CATEGORY.BRING_BACK && m.enabled
    );

    // === SUSPENDED RULES MODE ===
    if (stage === MEETING_STAGES.SUSPENDED_RULES) {
        return (
            <div className="action-buttons">
                {/* New Speaking List (chair only) */}
                {isChair && (
                    <button onClick={onNewSpeakingList}>New Speaking List</button>
                )}

                {/* Speak buttons */}
                {!speakingQueue.find(s => s.participant === currentUser.name) && (
                    <>
                        <button onClick={() => onRequestToSpeak('pro')} style={{background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white'}}>
                            Speak in Favor
                        </button>
                        <button onClick={() => onRequestToSpeak('con')} style={{background: 'linear-gradient(135deg, #c0392b 0%, #96281b 100%)', color: 'white'}}>
                            Speak Against
                        </button>
                    </>
                )}

                {/* Recognize Speaker (chair only) */}
                {isChair && speakingQueue.length > 0 && !currentSpeaker && (
                    <button onClick={onRecognizeSpeaker}>Recognize Next Speaker</button>
                )}

                {/* Yield Floor (speaker) */}
                {currentSpeaker && currentSpeaker.participant === currentUser.name && (
                    <button onClick={onFinishSpeaking} style={{background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: '#ffffff', fontWeight: '700'}}>
                        Yield Floor
                    </button>
                )}

                {/* Speaker Yields (chair) */}
                {isChair && currentSpeaker && currentSpeaker.participant !== currentUser.name && (
                    <button onClick={onFinishSpeaking} className="secondary">
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
                        <button onClick={() => onSuspendedVote(suspendedThreshold)} style={{ width: '100%' }}>
                            Call Vote
                        </button>
                    </div>
                )}

                {/* Resume Regular Rules (chair only) */}
                {isChair && (
                    <button onClick={onResumeFromSuspendedRules} className="danger">
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
                <button onClick={onCallToOrder}>Call Meeting to Order</button>
            )}

            {/* Roll Call */}
            {(currentUser.role === ROLES.SECRETARY || isChair) && stage === MEETING_STAGES.ROLL_CALL && allResponded && (
                <button onClick={onRollCall}>Complete Roll Call</button>
            )}

            {/* Approve Minutes */}
            {isChair && stage === MEETING_STAGES.APPROVE_MINUTES && (
                <button onClick={onApproveMinutes}>Approve Minutes</button>
            )}

            {/* Recess controls */}
            {stage === MEETING_STAGES.RECESS && isChair && (
                <button onClick={onResumeFromRecess}>Resume Meeting</button>
            )}

            {/* Recognize Speaker (chair only during debate, not during Point of Order) */}
            {isChair && stage === MEETING_STAGES.MOTION_DISCUSSION && speakingQueue.length > 0 && !currentSpeaker &&
             !(pendingAmendments && pendingAmendments.length > 0) && !hasPendingPointOfOrder && (
                <button onClick={onRecognizeSpeaker}>
                    Recognize Next Speaker
                </button>
            )}

            {/* Yield Floor (speaker) */}
            {currentSpeaker && currentSpeaker.participant === currentUser.name && (
                <button onClick={onFinishSpeaking} style={{background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: '#ffffff', fontWeight: '700'}}>
                    Yield Floor
                </button>
            )}

            {/* Speaker Yields (chair) */}
            {isChair && currentSpeaker && currentSpeaker.participant !== currentUser.name && (
                <button onClick={onFinishSpeaking} className="secondary">
                    Speaker Yields Floor
                </button>
            )}

            {/* Call the Question (chair) — hide during Point of Order */}
            {isChair && stage === MEETING_STAGES.MOTION_DISCUSSION &&
             !(pendingAmendments && pendingAmendments.length > 0) && !hasPendingPointOfOrder && (
                <button onClick={onCallVote}>Call the Question (Vote)</button>
            )}

            {/* Adjourn (no business pending) */}
            {isChair && stage === MEETING_STAGES.NEW_BUSINESS && motionStack.length === 0 && !currentMotion && (
                <button onClick={onAdjourn} className="danger">Adjourn Meeting</button>
            )}

            {/* === NEW BUSINESS AREA === */}
            {stage === MEETING_STAGES.NEW_BUSINESS && motionStack.length === 0 && !currentMotion && (
                <>
                    <div style={{display: 'flex', gap: '0.75rem', width: '100%'}}>
                        <button onClick={onNewMotion} style={{flex: 1}}>Original Motion</button>
                        <button onClick={onIncidentalMainMotion} className="secondary" style={{flex: 1}}>Incidental</button>
                    </div>

                    {/* Bring-Back Motions */}
                    {bringBackMotions.length > 0 && (
                        <div style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
                            {bringBackMotions.map(m => (
                                <button
                                    key={m.motionType}
                                    onClick={() => onBringBackMotion(m.motionType)}
                                    className="secondary"
                                    style={{flex: 1, fontSize: '0.85rem', padding: '0.5rem'}}
                                >
                                    {m.displayName}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* === UNIVERSAL SECOND BUTTON (Fix 2) === */}
            {top?.status === 'pending_second' && currentUser.name !== top.mover && (
                <button onClick={onSecondMotion}>
                    Second: {top.displayName || 'the Motion'}
                </button>
            )}

            {/* === CHAIR CONFIRM SECOND (Fix 3) === */}
            {isChair && top?.status === 'pending_second' && (
                <>
                    <button onClick={onSecondMotion} className="secondary">
                        Confirm Second (oral)
                    </button>
                    <button onClick={onDeclareNoSecond} className="danger" style={{ fontSize: '0.85rem' }}>
                        No Second — Motion Falls
                    </button>
                </>
            )}

            {/* Speak buttons (only when debate is allowed, hide during Point of Order - Fix 4) */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && debateAllowed && !hasPendingPointOfOrder &&
             !speakingQueue.find(s => s.participant === currentUser.name) && (
                <>
                    <button onClick={() => onRequestToSpeak('pro')} style={{background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)', color: 'white'}}>
                        Speak in Favor
                    </button>
                    <button onClick={() => onRequestToSpeak('con')} style={{background: 'linear-gradient(135deg, #c0392b 0%, #96281b 100%)', color: 'white'}}>
                        Speak Against
                    </button>
                </>
            )}

            {/* Propose Amendment — hide during Point of Order (Fix 4) */}
            {stage === MEETING_STAGES.MOTION_DISCUSSION && isMotionAvailable(MOTION_TYPES.AMEND) && !hasPendingPointOfOrder && (
                <button onClick={onAmendMotion} className="secondary">
                    Propose Amendment
                </button>
            )}

            {/* New Speaking List (chair only during MOTION_DISCUSSION — Fix 7) */}
            {isChair && stage === MEETING_STAGES.MOTION_DISCUSSION && (
                <button onClick={onNewSpeakingList} className="secondary" style={{ fontSize: '0.85rem' }}>
                    New Speaking List
                </button>
            )}

            {/* === SUBSIDIARY MOTIONS — hide during Point of Order (Fix 4) === */}
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
                                onClick={() => onSubsidiaryMotion(m.motionType)}
                                className="secondary"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                {m.displayName}
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
                                onClick={() => onPrivilegedMotion(m.motionType)}
                                className="secondary"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                {m.displayName}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* === INCIDENTAL MOTIONS === */}
            {stage !== MEETING_STAGES.ADJOURNED && stage !== MEETING_STAGES.NOT_STARTED && (
                <div style={{ width: '100%' }}>
                    <div style={{
                        fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                        Incidental Motions
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
                        <button
                            onClick={onPointOfOrder}
                            className="secondary"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            disabled={hasPendingPointOfOrder}
                        >
                            Point of Order
                        </button>
                        <button
                            onClick={onParliamentaryInquiry}
                            className="secondary"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Parl. Inquiry
                        </button>
                        <button
                            onClick={onRequestForInfo}
                            className="secondary"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Request Info
                        </button>
                        {lastChairRuling && (
                            <button
                                onClick={onAppeal}
                                className="secondary"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                Appeal Chair
                            </button>
                        )}
                        {stage === MEETING_STAGES.VOTING && (
                            <button
                                onClick={onDivision}
                                className="secondary"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                Division
                            </button>
                        )}
                        <button
                            onClick={onSuspendRules}
                            className="secondary"
                            style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                        >
                            Suspend Rules
                        </button>
                        {motionStack.length > 0 && top?.mover === currentUser.name && (
                            <button
                                onClick={onWithdrawMotion}
                                className="secondary"
                                style={{flex: '1 1 45%', fontSize: '0.85rem', padding: '0.5rem'}}
                            >
                                Withdraw Motion
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
