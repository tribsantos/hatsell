import React from 'react';
import { MEETING_STAGES, ROLES } from '../constants';
import MeetingStage from './MeetingStage';
import ChairGuidance from './ChairGuidance';
import RollCallSection from './RollCallSection';
import MinutesApprovalSection from './MinutesApprovalSection';
import VotingSection from './VotingSection';
import ActionButtons from './ActionButtons';
import MotionStackDisplay from './MotionStackDisplay';
import PendingRequestsPanel from './PendingRequestsPanel';
import TabledMotionsList from './TabledMotionsList';
import DecidedMotionsList from './DecidedMotionsList';
import { exportMinutes } from '../services/minutesExport';
import QuorumSettingSection from './QuorumSettingSection';
import SpeakingTimer from './SpeakingTimer';
import { formatQuorumRule } from '../engine/quorum';
import { getDebateConstraints } from '../engine/debateEngine';
import { REQUEST_FLOWS } from '../engine/pendingRequests';

export default function MeetingView({
    meetingState,
    currentUser,
    onCallToOrder,
    onRollCall,
    onCallMember,
    onMarkPresent,
    onRespondToRollCall,
    onApproveMinutes,
    onNewMotion,
    onSecondMotion,
    onRequestToSpeak,
    onRecognizeSpeaker,
    onFinishSpeaking,
    onCallVote,
    onVote,
    onAnnounceResult,
    onAdjourn,
    onAmendMotion,
    onSecondAmendment,
    onRecognizeAmendment,
    onDismissAmendment,
    onPointOfOrder,
    onRuleOnPointOfOrder,
    updateMeetingState,
    addToLog,
    setShowModal,
    handleObjectToCorrection,
    handleAcceptCorrectionByConsent,
    onCallVoteOnMinutesCorrection,
    onAcknowledgeAnnouncement,
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
    onAcceptRequest,
    onRespondToRequest,
    onDismissRequest,
    onRuleOnPointOfOrderRequest,
    onResumeFromRecess,
    onNewSpeakingList,
    onResumePreviousSpeakingList,
    onResumeFromSuspendedRules,
    onSuspendedVote,
    onDeclareNoSecond,
    onSetQuorum,
    onChairAcceptMotion,
    onChairRejectMotion,
    onRecognizePendingMotion,
    onDismissPendingMotion,
    onPreChairWithdraw
}) {
    const isChair = currentUser.role === ROLES.PRESIDENT || currentUser.role === ROLES.VICE_PRESIDENT;
    const motionStack = meetingState.motionStack || [];
    const pendingRequests = meetingState.pendingRequests || [];

    return (
        <div className="meeting-container">
            <aside className="panel">
                <h3>Participants ({meetingState.participants.length})</h3>
                <ul className="participants-list">
                    {meetingState.participants.map((p, idx) => (
                        <li
                            key={idx}
                            className={`participant-item ${
                                p.role === ROLES.PRESIDENT ? 'chair' : ''
                            } ${
                                p.role === ROLES.VICE_PRESIDENT ? 'vice-president' : ''
                            } ${
                                meetingState.currentSpeaker?.participant === p.name ? 'speaking' : ''
                            }`}
                        >
                            <div className="participant-name">{p.name}</div>
                            <div className="participant-role">{p.role}</div>
                        </li>
                    ))}
                </ul>

                {/* Quorum status */}
                {meetingState.quorumRule && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: meetingState.participants.length >= meetingState.quorum
                            ? 'rgba(39, 174, 96, 0.08)'
                            : 'rgba(192, 57, 43, 0.08)',
                        borderLeft: `4px solid ${meetingState.participants.length >= meetingState.quorum ? '#27ae60' : '#c0392b'}`,
                        borderRadius: '3px',
                        fontSize: '0.85rem'
                    }}>
                        <strong>Quorum:</strong> {meetingState.participants.length} of {meetingState.quorum} required
                        <br />
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>
                            Rule: {formatQuorumRule(meetingState.quorumRule)}
                        </span>
                    </div>
                )}

                {/* Quorum setting (Chair only, during CALL_TO_ORDER or ROLL_CALL, and not yet set) */}
                {isChair && !meetingState.quorumRule && (
                    meetingState.stage === MEETING_STAGES.CALL_TO_ORDER ||
                    meetingState.stage === MEETING_STAGES.ROLL_CALL
                ) && (
                    <div style={{ marginTop: '1rem' }}>
                        <QuorumSettingSection
                            onSetQuorum={onSetQuorum}
                            currentRule={meetingState.quorumRule}
                        />
                    </div>
                )}

                {/* Tabled and Decided Motions in sidebar */}
                <TabledMotionsList tabledMotions={meetingState.tabledMotions} isChair={isChair} />
                <DecidedMotionsList decidedMotions={meetingState.decidedMotions} />
            </aside>

            <main className="panel">
                <MeetingStage
                    stage={meetingState.stage}
                    currentMotion={meetingState.currentMotion}
                    motionStack={motionStack}
                    suspendedRulesPurpose={meetingState.suspendedRulesPurpose}
                />

                <ChairGuidance
                    meetingState={meetingState}
                    currentUser={currentUser}
                    isChair={isChair}
                    onAcknowledgeAnnouncement={onAcknowledgeAnnouncement}
                />

                {/* Interrupting Motion Banner */}
                {pendingRequests.filter(r => {
                    const flow = REQUEST_FLOWS[r.type];
                    return flow?.canInterrupt && (r.status === 'pending' || r.status === 'accepted');
                }).map(r => {
                    const isSpeaker = meetingState.currentSpeaker?.participant === currentUser.name;
                    return (
                        <div key={r.id} style={{
                            background: '#fff3cd',
                            border: '3px solid #e67e22',
                            borderRadius: '4px',
                            padding: '1.25rem',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            <h4 style={{ color: '#e67e22', marginBottom: '0.5rem', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {r.displayName}
                            </h4>
                            <p style={{ color: '#333', marginBottom: '0.25rem' }}>
                                Raised by <strong>{r.raisedBy}</strong>
                            </p>
                            {r.content && (
                                <p style={{ fontStyle: 'italic', color: '#555' }}>"{r.content}"</p>
                            )}
                            {isSpeaker && (
                                <p style={{
                                    marginTop: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'rgba(192, 57, 43, 0.08)',
                                    borderRadius: '4px',
                                    color: '#c0392b',
                                    fontWeight: '700'
                                }}>
                                    Please suspend your intervention. Your clock has been paused.
                                </p>
                            )}
                        </div>
                    );
                })}

                {/* Pending Requests Panel (Parliamentary Inquiry, Point of Order, etc.) */}
                <PendingRequestsPanel
                    pendingRequests={pendingRequests}
                    isChair={isChair}
                    currentUser={currentUser}
                    onAcceptRequest={onAcceptRequest}
                    onRespondToRequest={onRespondToRequest}
                    onDismissRequest={onDismissRequest}
                    onRuleOnPointOfOrder={onRuleOnPointOfOrderRequest}
                    onConvertToMotion={() => {}}
                />

                {/* Legacy Point of Order display */}
                {meetingState.pendingPointOfOrder && (
                    <div className="warning-box" style={{marginBottom: '2rem'}}>
                        <h4 style={{color: '#e67e22', marginBottom: '0.5rem'}}>POINT OF ORDER</h4>
                        <p><strong>Raised by:</strong> {meetingState.pendingPointOfOrder.raisedBy}</p>
                        <p><strong>Concern:</strong> {meetingState.pendingPointOfOrder.concern}</p>
                        {isChair && (
                            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                <button onClick={() => onRuleOnPointOfOrder('sustained')} style={{flex: 1}}>
                                    Sustain Point of Order
                                </button>
                                <button onClick={() => onRuleOnPointOfOrder('not sustained')} className="secondary" style={{flex: 1}}>
                                    Point Not Sustained
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {meetingState.pendingAmendments && meetingState.pendingAmendments.length > 0 && isChair && (
                    <div className="info-box" style={{marginBottom: '2rem', background: 'rgba(230, 126, 34, 0.08)'}}>
                        <h4 style={{color: '#e67e22', marginBottom: '1rem'}}>Pending Amendments ({meetingState.pendingAmendments.length})</h4>
                        {meetingState.currentSpeaker ? (
                            <p style={{marginBottom: '1rem', color: '#999', fontWeight: '600', fontStyle: 'italic'}}>
                                A member has the floor — wait for them to yield before recognizing amendments.
                            </p>
                        ) : (
                            <p style={{marginBottom: '1rem', color: '#e67e22', fontWeight: '600'}}>You must recognize or decline pending amendments before proceeding.</p>
                        )}
                        {meetingState.pendingAmendments.map((amendment, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(0, 0, 0, 0.04)',
                                padding: '1rem',
                                marginBottom: idx < meetingState.pendingAmendments.length - 1 ? '0.75rem' : '0',
                                borderRadius: '4px',
                                borderLeft: '3px solid #e67e22'
                            }}>
                                <p style={{marginBottom: '0.5rem'}}><strong>{amendment.proposer}</strong> wishes to propose:</p>
                                <p style={{fontStyle: 'italic', marginBottom: '1rem', fontSize: '0.95rem'}}>"{amendment.text}"</p>
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                    <button
                                        onClick={() => onRecognizeAmendment(amendment)}
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem', ...(meetingState.currentSpeaker ? {opacity: 0.45} : {})}}
                                        disabled={!!meetingState.currentSpeaker}
                                    >
                                        Recognize Amendment
                                    </button>
                                    <button
                                        onClick={() => onDismissAmendment(amendment)}
                                        className="secondary"
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem'}}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pending Motions (non-interrupting motions queued while speaker had the floor) */}
                {(meetingState.pendingMotions || []).length > 0 && isChair && (
                    <div className="info-box" style={{marginBottom: '2rem', background: 'rgba(52, 152, 219, 0.08)'}}>
                        <h4 style={{color: '#2980b9', marginBottom: '1rem'}}>Pending Motions ({meetingState.pendingMotions.length})</h4>
                        {meetingState.currentSpeaker ? (
                            <p style={{marginBottom: '1rem', color: '#999', fontWeight: '600', fontSize: '0.85rem', fontStyle: 'italic'}}>
                                A member has the floor — wait for them to yield before recognizing motions.
                            </p>
                        ) : (
                            <p style={{marginBottom: '1rem', color: '#2980b9', fontWeight: '600', fontSize: '0.85rem'}}>
                                These motions were proposed while a speaker had the floor. Recognize or dismiss them.
                            </p>
                        )}
                        {meetingState.pendingMotions.map((pm, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(0, 0, 0, 0.04)',
                                padding: '1rem',
                                marginBottom: idx < meetingState.pendingMotions.length - 1 ? '0.75rem' : '0',
                                borderRadius: '4px',
                                borderLeft: '3px solid #2980b9'
                            }}>
                                <p style={{marginBottom: '0.25rem', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.03em'}}>
                                    {pm.displayName}
                                </p>
                                <p style={{marginBottom: '0.5rem'}}><strong>{pm.proposer}</strong> moves: "{pm.text}"</p>
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                    <button
                                        onClick={() => {
                                            if (typeof onRecognizePendingMotion !== 'function') {
                                                updateMeetingState({
                                                    log: [...meetingState.log, {
                                                        timestamp: new Date().toLocaleTimeString(),
                                                        message: 'Recognize handler missing or not a function.'
                                                    }]
                                                });
                                                return;
                                            }
                                            onRecognizePendingMotion(idx);
                                        }}
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem', ...(meetingState.currentSpeaker ? {opacity: 0.45} : {})}}
                                        disabled={!!meetingState.currentSpeaker}
                                    >
                                        Recognize
                                    </button>
                                    <button
                                        onClick={() => onDismissPendingMotion(idx)}
                                        className="secondary"
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem'}}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {meetingState.stage === MEETING_STAGES.ROLL_CALL && (
                    <RollCallSection
                        participants={meetingState.participants}
                        rollCallStatus={meetingState.rollCallStatus || {}}
                        currentUser={currentUser}
                        isChair={isChair}
                        onCallMember={onCallMember}
                        onMarkPresent={onMarkPresent}
                        onRespondToRollCall={onRespondToRollCall}
                    />
                )}

                {meetingState.stage === MEETING_STAGES.APPROVE_MINUTES && (
                    <MinutesApprovalSection
                        currentUser={currentUser}
                        isChair={isChair}
                        meetingState={meetingState}
                        onRequestReadMinutes={() => {
                            updateMeetingState({
                                log: [...meetingState.log, {
                                    timestamp: new Date().toLocaleTimeString(),
                                    message: `${currentUser.name} requests that the minutes be read`
                                }]
                            });
                        }}
                        onRequestCorrection={() => {
                            setShowModal('minutesCorrection');
                        }}
                        onObjectToCorrection={handleObjectToCorrection}
                        onAcceptByConsent={handleAcceptCorrectionByConsent}
                        onCallVoteOnCorrection={onCallVoteOnMinutesCorrection}
                    />
                )}

                {/* Motion Stack Display */}
                <MotionStackDisplay motionStack={motionStack} isChair={isChair} />

                {/* Legacy current motion display (only if no stack but currentMotion exists for minutes correction) */}
                {meetingState.currentMotion && motionStack.length === 0 && (
                    <div className="current-motion">
                        <h4>Motion on the Floor</h4>
                        <div className="motion-text">{meetingState.currentMotion.text}</div>
                        <div className="motion-meta">
                            <div>Moved by: {meetingState.currentMotion.mover}</div>
                            {meetingState.currentMotion.seconder && (
                                <div>Seconded by: {meetingState.currentMotion.seconder}</div>
                            )}
                        </div>
                    </div>
                )}

                {meetingState.stage === MEETING_STAGES.VOTING && (
                    <VotingSection
                        votes={meetingState.votes}
                        isChair={isChair}
                        currentUser={currentUser}
                        onVote={onVote}
                        onAnnounceResult={onAnnounceResult}
                        votedBy={meetingState.votedBy || []}
                        motionStack={motionStack}
                        onDivision={onDivision}
                    />
                )}

                {meetingState.stage === MEETING_STAGES.ADJOURNED && (
                    <div style={{
                        background: 'rgba(39, 174, 96, 0.08)',
                        border: '2px solid #27ae60',
                        borderRadius: '4px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ marginBottom: '1rem', fontWeight: '600', color: '#1e8449' }}>
                            Meeting adjourned. You can export the minutes below.
                        </p>
                        <button
                            onClick={() => exportMinutes(meetingState)}
                            style={{ background: '#27ae60' }}
                        >
                            Export Minutes (.docx)
                        </button>
                    </div>
                )}

                {/* Speaking Timer — visible to all participants */}
                {meetingState.currentSpeaker && (
                    <SpeakingTimer
                        currentSpeaker={meetingState.currentSpeaker}
                        maxDurationMinutes={getDebateConstraints(motionStack).maxSpeechDuration || null}
                    />
                )}

                <ActionButtons
                    meetingState={meetingState}
                    currentUser={currentUser}
                    isChair={isChair}
                    onCallToOrder={onCallToOrder}
                    onRollCall={onRollCall}
                    onApproveMinutes={onApproveMinutes}
                    onNewMotion={onNewMotion}
                    onSecondMotion={onSecondMotion}
                    onRequestToSpeak={onRequestToSpeak}
                    onRecognizeSpeaker={onRecognizeSpeaker}
                    onFinishSpeaking={onFinishSpeaking}
                    onCallVote={onCallVote}
                    onAdjourn={onAdjourn}
                    onAmendMotion={onAmendMotion}
                    onSecondAmendment={onSecondAmendment}
                    onRecognizeAmendment={onRecognizeAmendment}
                    onDismissAmendment={onDismissAmendment}
                    onPointOfOrder={onPointOfOrder}
                    onRuleOnPointOfOrder={onRuleOnPointOfOrder}
                    onIncidentalMainMotion={onIncidentalMainMotion}
                    onIncidentalMotions={onIncidentalMotions}
                    onSubsidiaryMotion={onSubsidiaryMotion}
                    onPrivilegedMotion={onPrivilegedMotion}
                    onBringBackMotion={onBringBackMotion}
                    onParliamentaryInquiry={onParliamentaryInquiry}
                    onRequestForInfo={onRequestForInfo}
                    onAppeal={onAppeal}
                    onSuspendRules={onSuspendRules}
                    onWithdrawMotion={onWithdrawMotion}
                    onDivision={onDivision}
                    onResumeFromRecess={onResumeFromRecess}
                    onNewSpeakingList={onNewSpeakingList}
                    onResumePreviousSpeakingList={onResumePreviousSpeakingList}
                    onResumeFromSuspendedRules={onResumeFromSuspendedRules}
                    onSuspendedVote={onSuspendedVote}
                    onDeclareNoSecond={onDeclareNoSecond}
                    onChairAcceptMotion={onChairAcceptMotion}
                    onChairRejectMotion={onChairRejectMotion}
                    onPreChairWithdraw={onPreChairWithdraw}
                />
            </main>

            <aside className="panel">
                <h3>Speaking Queue</h3>
                {meetingState.currentSpeaker && (
                    <div className="info-box">
                        <strong>Currently Speaking:</strong><br />
                        {meetingState.currentSpeaker.participant}
                        <span className={`stance-badge ${meetingState.currentSpeaker.stance}`}>
                            {meetingState.currentSpeaker.stance}
                        </span>
                    </div>
                )}
                <ul className="speaking-queue">
                    {meetingState.speakingQueue.map((item, idx) => (
                        <li key={idx} className={`queue-item ${item.stance}`}>
                            <div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <span>{item.participant}</span>
                                    {item.hasSpokenBefore && (
                                        <span style={{fontSize: '0.75rem', opacity: 0.6}}>(repeat)</span>
                                    )}
                                </div>
                                <span className={`stance-badge ${item.stance}`}>
                                    {item.stance}
                                </span>
                            </div>
                            <div className="queue-position">{idx + 1}</div>
                        </li>
                    ))}
                </ul>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Meeting Log</h3>
                    <button
                        onClick={() => exportMinutes(meetingState)}
                        className="secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        data-tooltip="Download formal minutes as an editable Word document"
                    >
                        Export Minutes (.docx)
                    </button>
                </div>
                <div className="meeting-log">
                    {meetingState.log.slice().reverse().map((entry, idx) => (
                        <div key={idx} className="log-entry">
                            <div className="log-timestamp">{entry.timestamp}</div>
                            <div>{entry.message}</div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
