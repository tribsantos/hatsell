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
    onResumeFromSuspendedRules,
    onSuspendedVote,
    onDeclareNoSecond
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
                        <p style={{marginBottom: '1rem', color: '#e67e22', fontWeight: '600'}}>You must recognize or decline pending amendments before proceeding.</p>
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
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem'}}
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
                    onResumeFromSuspendedRules={onResumeFromSuspendedRules}
                    onSuspendedVote={onSuspendedVote}
                    onDeclareNoSecond={onDeclareNoSecond}
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

                <h3 style={{ marginTop: '2rem' }}>Meeting Log</h3>
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
