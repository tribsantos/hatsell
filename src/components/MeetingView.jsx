import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES, ROLES } from '../constants';
import MeetingStage from './MeetingStage';
import ChairGuidance from './ChairGuidance';
import RollCallSection from './RollCallSection';
import MinutesApprovalSection from './MinutesApprovalSection';
import VotingSection from './VotingSection';
import { ChairActions, MemberActions } from './ActionButtons';
import MotionStackDisplay from './MotionStackDisplay';
import PendingRequestsPanel from './PendingRequestsPanel';
import { exportMinutes } from '../services/minutesExport';
import SpeakingTimer from './SpeakingTimer';
import { getDebateConstraints } from '../engine/debateEngine';
import { REQUEST_FLOWS } from '../engine/pendingRequests';
import { getRules } from '../engine/motionRules';
import { getCategoryLabel } from '../constants/agenda';

function FloatingNotifications({ notifications, onDismiss }) {
    const { t } = useTranslation('meeting');
    useEffect(() => {
        if (!notifications || notifications.length === 0) return;
        const timers = notifications.map((n, i) => {
            const age = Date.now() - n.timestamp;
            const remaining = Math.max(0, 4000 - age);
            return setTimeout(() => onDismiss(n.timestamp), remaining);
        });
        return () => timers.forEach(clearTimeout);
    }, [notifications, onDismiss]);

    if (!notifications || notifications.length === 0) return null;

    return (
        <div className="floating-toasts">
            {notifications.map((n, i) => (
                <div key={n.timestamp + n.name} className={`floating-toast ${n.type === 'join' ? 'join' : 'leave'}`}>
                    {n.type === 'join' ? t('notification_joined', { name: n.name }) : t('notification_left', { name: n.name })}
                </div>
            ))}
        </div>
    );
}

function RecessTimer({ recessEnd }) {
    const { t } = useTranslation('meeting');
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!recessEnd) return null;

    const remaining = Math.floor((recessEnd - now) / 1000);
    const isOvertime = remaining <= 0;
    const abs = Math.abs(remaining);
    const m = Math.floor(abs / 60);
    const s = abs % 60;
    const display = `${isOvertime ? '-' : ''}${m}:${s.toString().padStart(2, '0')}`;

    return (
        <div className={`recess-card ${isOvertime ? 'overtime' : ''}`}>
            <div className="recess-label">{t('recess_label')}</div>
            {isOvertime && (
                <div className="recess-overtime">{t('recess_overtime')}</div>
            )}
            <div className="recess-time">{display}</div>
            <div className="recess-sub">{isOvertime ? t('recess_over') : t('recess_remaining')}</div>
        </div>
    );
}

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
    handleRecognizeCorrection,
    handleReturnCorrection,
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
    onChairAcceptMotion,
    onChairRejectMotion,
    onRecognizePendingMotion,
    onDismissPendingMotion,
    onPreChairWithdraw,
    onOrdersOfTheDay,
    onOrdersOfTheDayResponse,
    onAdoptAgenda,
    onNextAgendaItem
}) {
    const { t } = useTranslation('meeting');
    const isChair = currentUser.role === ROLES.PRESIDENT || currentUser.role === ROLES.VICE_PRESIDENT;
    const motionStack = meetingState.motionStack || [];
    const pendingRequests = meetingState.pendingRequests || [];

    const dismissNotification = useCallback((timestamp) => {
        if (updateMeetingState) {
            const filtered = (meetingState.notifications || []).filter(n => n.timestamp !== timestamp);
            updateMeetingState({ notifications: filtered });
        }
    }, [meetingState.notifications, updateMeetingState]);

    return (
        <div className="meeting-container">
            <FloatingNotifications
                notifications={meetingState.notifications || []}
                onDismiss={dismissNotification}
            />

            <main className="panel" id="main-content">
                <MeetingStage
                    stage={meetingState.stage}
                    currentMotion={meetingState.currentMotion}
                    motionStack={motionStack}
                    suspendedRulesPurpose={meetingState.suspendedRulesPurpose}
                    agendaItems={meetingState.meetingSettings?.agendaItems}
                    currentAgendaIndex={meetingState.currentAgendaIndex}
                />

                {meetingState.stage === MEETING_STAGES.ADOPT_AGENDA && (() => {
                    const agendaItems = meetingState.meetingSettings?.agendaItems || [];
                    return (
                        <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--h-blue)', marginBottom: '0.75rem' }}>{t('proposed_agenda')}</h4>
                            {agendaItems.map((item, idx) => (
                                <div key={item.id || idx} style={{
                                    padding: '0.5rem 0.75rem', marginBottom: '0.35rem',
                                    background: 'rgba(0,0,0,0.03)', borderRadius: '3px',
                                    borderLeft: '3px solid var(--h-blue)'
                                }}>
                                    <span style={{ fontWeight: 600 }}>{idx + 1}. {item.title}</span>
                                    <span style={{ color: 'var(--h-fg-dim)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                                        {getCategoryLabel(item.category)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                {meetingState.stage === MEETING_STAGES.AGENDA_ITEM && (() => {
                    const agendaItems = meetingState.meetingSettings?.agendaItems || [];
                    const idx = meetingState.currentAgendaIndex ?? 0;
                    const item = agendaItems[idx];
                    if (!item) return null;
                    return (
                        <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h4 style={{ color: 'var(--h-blue)' }}>
                                    {t('agenda_item_of', { index: idx + 1, total: agendaItems.length, title: item.title })}
                                </h4>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--h-fg-muted)', marginTop: '0.25rem' }}>
                                {getCategoryLabel(item.category)}
                                {item.owner && ` \u2014 ${item.owner}`}
                                {item.timeTarget && ` ${t('agenda_min_target', { minutes: item.timeTarget })}`}
                            </div>
                            {item.notes && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--h-fg-muted)', fontStyle: 'italic' }}>
                                    {item.notes}
                                </div>
                            )}
                        </div>
                    );
                })()}

                <ChairGuidance
                    meetingState={meetingState}
                    currentUser={currentUser}
                    isChair={isChair}
                    onAcknowledgeAnnouncement={onAcknowledgeAnnouncement}
                />

                {/* Chair Actions — immediately below guidance for quick access */}
                {isChair && (
                    <ChairActions
                        meetingState={meetingState}
                        currentUser={currentUser}
                        onCallToOrder={onCallToOrder}
                        onRollCall={onRollCall}
                        onApproveMinutes={onApproveMinutes}
                        onRecognizeSpeaker={onRecognizeSpeaker}
                        onFinishSpeaking={onFinishSpeaking}
                        onCallVote={onCallVote}
                        onAdjourn={onAdjourn}
                        onRecognizeAmendment={onRecognizeAmendment}
                        onDismissAmendment={onDismissAmendment}
                        onAcknowledgeAnnouncement={onAcknowledgeAnnouncement}
                        onResumeFromRecess={onResumeFromRecess}
                        onNewSpeakingList={onNewSpeakingList}
                        onResumePreviousSpeakingList={onResumePreviousSpeakingList}
                        onResumeFromSuspendedRules={onResumeFromSuspendedRules}
                        onSuspendedVote={onSuspendedVote}
                        onDeclareNoSecond={onDeclareNoSecond}
                        onChairAcceptMotion={onChairAcceptMotion}
                        onChairRejectMotion={onChairRejectMotion}
                        onSecondMotion={onSecondMotion}
                        onOrdersOfTheDayResponse={onOrdersOfTheDayResponse}
                        onAdoptAgenda={onAdoptAgenda}
                        onNextAgendaItem={onNextAgendaItem}
                    />
                )}

                {/* Interrupting Motion Banner */}
                {pendingRequests.filter(r => {
                    const flow = REQUEST_FLOWS[r.type];
                    return flow?.canInterrupt && (r.status === 'pending' || r.status === 'accepted');
                }).map(r => {
                    const isSpeaker = meetingState.currentSpeaker?.participant === currentUser.name;
                    return (
                        <div key={r.id} className="warning-box" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            <h4 style={{ color: 'var(--h-amber)', marginBottom: '0.5rem', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {r.displayName}
                            </h4>
                            <p style={{ color: 'var(--h-fg)', marginBottom: '0.25rem' }}>
                                {t('interrupted_raised_by', { name: r.raisedBy })}
                            </p>
                            {r.content && (
                                <p style={{ fontStyle: 'italic', color: 'var(--h-fg-muted)' }}>"{r.content}"</p>
                            )}
                            {isSpeaker && (
                                <p style={{
                                    marginTop: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'var(--h-red-light)',
                                    borderRadius: '4px',
                                    color: 'var(--h-red)',
                                    fontWeight: '700'
                                }}>
                                    {t('interrupted_suspend')}
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
                        <h4 style={{color: 'var(--h-amber)', marginBottom: '0.5rem'}}>{t('point_of_order_banner')}</h4>
                        <p><strong>{t('raised_by')}</strong> {meetingState.pendingPointOfOrder.raisedBy}</p>
                        <p><strong>{t('concern_label')}</strong> {meetingState.pendingPointOfOrder.concern}</p>
                        {isChair && (
                            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                <button onClick={() => onRuleOnPointOfOrder('sustained')} style={{flex: 1}}>
                                    {t('sustain_point')}
                                </button>
                                <button onClick={() => onRuleOnPointOfOrder('not sustained')} className="secondary" style={{flex: 1}}>
                                    {t('point_not_sustained')}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {meetingState.pendingAmendments && meetingState.pendingAmendments.length > 0 && isChair && (() => {
                    const isVoting = meetingState.stage === MEETING_STAGES.VOTING;
                    const hasSpeaker = !!meetingState.currentSpeaker;
                    const amendBlocked = hasSpeaker || isVoting;

                    return (
                    <div className="info-box" style={{marginBottom: '2rem', background: 'rgba(230, 126, 34, 0.08)'}}>
                        <h4 style={{color: 'var(--h-amber)', marginBottom: '1rem'}}>{t('pending_amendments_title', { count: meetingState.pendingAmendments.length })}</h4>
                        {hasSpeaker ? (
                            <p style={{marginBottom: '1rem', color: 'var(--h-fg-dim)', fontWeight: '600', fontStyle: 'italic'}}>
                                {t('amend_wait_speaker')}
                            </p>
                        ) : isVoting ? (
                            <p style={{marginBottom: '1rem', color: 'var(--h-fg-dim)', fontWeight: '600', fontStyle: 'italic'}}>
                                {t('amend_wait_vote')}
                            </p>
                        ) : (
                            <p style={{marginBottom: '1rem', color: 'var(--h-amber)', fontWeight: '600'}}>{t('amend_must_recognize')}</p>
                        )}
                        {meetingState.pendingAmendments.map((amendment, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(0, 0, 0, 0.04)',
                                padding: '1rem',
                                marginBottom: idx < meetingState.pendingAmendments.length - 1 ? '0.75rem' : '0',
                                borderRadius: '4px',
                                borderLeft: '3px solid var(--h-amber)',
                                opacity: amendBlocked ? 0.7 : 1
                            }}>
                                <p style={{marginBottom: '0.5rem'}}>{t('amend_proposer_wishes', { name: amendment.proposer })}</p>
                                <p style={{fontStyle: 'italic', marginBottom: '1rem', fontSize: '0.95rem'}}>"{amendment.text}"</p>
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                    <button
                                        onClick={() => !amendBlocked && onRecognizeAmendment(amendment)}
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem', ...(amendBlocked ? {opacity: 0.45} : {})}}
                                        disabled={amendBlocked}
                                    >
                                        {t('recognize_amendment')}
                                    </button>
                                    <button
                                        onClick={() => !amendBlocked && onDismissAmendment(amendment)}
                                        className="secondary"
                                        disabled={amendBlocked}
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem', ...(amendBlocked ? {opacity: 0.45} : {})}}
                                    >
                                        {t('decline_amendment')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    );
                })()}

                {/* Pending Motions (non-interrupting motions queued while speaker had the floor) */}
                {(meetingState.pendingMotions || []).length > 0 && isChair && (() => {
                    // Sort by precedence descending (highest first) and track original indices
                    const indexed = (meetingState.pendingMotions || []).map((pm, idx) => ({ pm, originalIndex: idx }));
                    indexed.sort((a, b) => {
                        const aPrec = getRules(a.pm.motionType)?.precedence ?? 0;
                        const bPrec = getRules(b.pm.motionType)?.precedence ?? 0;
                        return bPrec - aPrec;
                    });
                    const highestPrec = getRules(indexed[0]?.pm.motionType)?.precedence ?? 0;

                    // Block all pending motion actions if a motion is awaiting a second on the stack
                    const topOfStack = motionStack.length > 0 ? motionStack[motionStack.length - 1] : null;
                    const awaitingSecond = topOfStack?.status === 'pending_second';

                    return (
                    <div className="info-box" style={{marginBottom: '2rem', background: 'var(--h-blue-light)'}}>
                        <h4 style={{color: 'var(--h-blue)', marginBottom: '1rem'}}>{t('pending_motions_title', { count: meetingState.pendingMotions.length })}</h4>
                        {meetingState.currentSpeaker ? (
                            <p style={{marginBottom: '1rem', color: 'var(--h-fg-dim)', fontWeight: '600', fontSize: '0.85rem', fontStyle: 'italic'}}>
                                {t('pending_wait_speaker')}
                            </p>
                        ) : awaitingSecond ? (
                            <p style={{marginBottom: '1rem', color: 'var(--h-amber)', fontWeight: '600', fontSize: '0.85rem', fontStyle: 'italic'}}>
                                {t('pending_awaiting_second')}
                            </p>
                        ) : (
                            <p style={{marginBottom: '1rem', color: 'var(--h-blue)', fontWeight: '600', fontSize: '0.85rem'}}>
                                {t('pending_resolve_priority')}
                            </p>
                        )}
                        {indexed.map(({ pm, originalIndex }, displayIdx) => {
                            const pmPrec = getRules(pm.motionType)?.precedence ?? 0;
                            const isHighest = pmPrec === highestPrec;
                            const blocked = !isHighest || !!meetingState.currentSpeaker || awaitingSecond;

                            return (
                            <div key={originalIndex} style={{
                                background: 'rgba(0, 0, 0, 0.04)',
                                padding: '1rem',
                                marginBottom: displayIdx < indexed.length - 1 ? '0.75rem' : '0',
                                borderRadius: '4px',
                                borderLeft: `3px solid ${isHighest ? 'var(--h-blue)' : 'rgba(102,102,102,0.3)'}`,
                                opacity: isHighest ? 1 : 0.7
                            }}>
                                <p style={{marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--h-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.03em'}}>
                                    {pm.displayName}
                                </p>
                                <p style={{marginBottom: '0.5rem'}}>{t('pending_moves', { name: pm.proposer, text: pm.text })}</p>
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                    <button
                                        onClick={() => {
                                            if (blocked) return;
                                            if (typeof onRecognizePendingMotion !== 'function') {
                                                updateMeetingState({
                                                    log: [...meetingState.log, {
                                                        timestamp: new Date().toLocaleTimeString(),
                                                        message: 'Recognize handler missing or not a function.'
                                                    }]
                                                });
                                                return;
                                            }
                                            onRecognizePendingMotion(originalIndex);
                                        }}
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem', ...(blocked ? {opacity: 0.45} : {})}}
                                        disabled={blocked}
                                        data-tooltip={!isHighest ? t('tooltip_resolve_higher') : (meetingState.currentSpeaker ? t('tooltip_wait_speaker') : t('tooltip_recognize_motion'))}
                                        title={!isHighest ? t('tooltip_resolve_higher') : (meetingState.currentSpeaker ? t('tooltip_wait_speaker') : t('tooltip_recognize_motion'))}
                                    >
                                        {t('recognize_button')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (blocked) return;
                                            onDismissPendingMotion(originalIndex);
                                        }}
                                        className="secondary"
                                        disabled={blocked}
                                        style={{flex: 1, padding: '0.5rem', fontSize: '0.9rem', ...(blocked ? {opacity: 0.45} : {})}}
                                        data-tooltip={!isHighest ? t('tooltip_resolve_higher') : awaitingSecond ? t('tooltip_awaiting_second') : t('tooltip_dismiss_motion')}
                                        title={!isHighest ? t('tooltip_resolve_higher') : awaitingSecond ? t('tooltip_awaiting_second') : t('tooltip_dismiss_motion')}
                                    >
                                        {t('dismiss_button')}
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                    );
                })()}

                {meetingState.stage === MEETING_STAGES.ROLL_CALL && (
                    <RollCallSection
                        participants={meetingState.participants}
                        rollCallStatus={meetingState.rollCallStatus || {}}
                        currentUser={currentUser}
                        isChair={isChair}
                        quorumRequired={meetingState.quorum}
                        hasQuorumRule={!!meetingState.quorumRule}
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
                                minutesReadRequest: { requestedBy: currentUser.name, timestamp: Date.now() },
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
                        onRecognizeCorrection={handleRecognizeCorrection}
                        onReturnCorrection={handleReturnCorrection}
                        onCallVoteOnCorrection={onCallVoteOnMinutesCorrection}
                        onReadMinutesResponse={(doRead) => {
                            if (doRead) {
                                updateMeetingState({
                                    minutesReadRequest: null,
                                    log: [...meetingState.log, {
                                        timestamp: new Date().toLocaleTimeString(),
                                        message: 'Chair directed the minutes to be read'
                                    }]
                                });
                            } else {
                                updateMeetingState({
                                    minutesReadRequest: null,
                                    log: [...meetingState.log, {
                                        timestamp: new Date().toLocaleTimeString(),
                                        message: 'Chair dismissed request to read minutes'
                                    }]
                                });
                            }
                        }}
                    />
                )}

                {/* Motion Stack Display */}
                <MotionStackDisplay motionStack={motionStack} isChair={isChair} decidedMotions={meetingState.decidedMotions} />

                {/* Legacy current motion display (only if no stack but currentMotion exists for minutes correction) */}
                {meetingState.currentMotion && motionStack.length === 0 && (
                    <div className="current-motion">
                        <h4>{t('motion_on_floor')}</h4>
                        <div className="motion-text">{meetingState.currentMotion.text}</div>
                        <div className="motion-meta">
                            <div>{t('moved_by_label', { name: meetingState.currentMotion.mover })}</div>
                            {meetingState.currentMotion.seconder && (
                                <div>{t('seconded_by_label', { name: meetingState.currentMotion.seconder })}</div>
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
                        voteStartTime={meetingState.voteStartTime}
                        participants={meetingState.participants}
                    />
                )}

                {meetingState.stage === MEETING_STAGES.ADJOURNED && (
                    <div className="info-box" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <p style={{ marginBottom: '1rem', fontWeight: '600', color: 'var(--h-green-dark)' }}>
                            {t('adjourned_export_msg')}
                        </p>
                        <button
                            onClick={() => exportMinutes(meetingState)}
                            className="success"
                        >
                            {t('export_minutes_docx')}
                        </button>
                    </div>
                )}

                {/* Speaking Timer — visible to all participants */}
                {meetingState.currentSpeaker && (
                    <SpeakingTimer
                        currentSpeaker={meetingState.currentSpeaker}
                        maxDurationMinutes={getDebateConstraints(motionStack, meetingState.orgProfile).maxSpeechDuration || null}
                        autoYield={!!meetingState.meetingSettings?.autoYieldOnTimeExpired}
                        onAutoYield={onFinishSpeaking}
                        currentUser={currentUser}
                        onYield={onFinishSpeaking}
                    />
                )}

                {/* Next Speaker — chair only, same position as member speak buttons */}
                {isChair && !meetingState.currentSpeaker &&
                 meetingState.stage === MEETING_STAGES.MOTION_DISCUSSION &&
                 (meetingState.speakingQueue || []).length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={onRecognizeSpeaker}
                            className="speak-btn-favor"
                            style={{ width: '100%' }}
                            data-tooltip={t('tooltip_next_speaker')}
                            title={t('tooltip_next_speaker')}
                        >
                            {t('next_speaker_queue', { count: (meetingState.speakingQueue || []).length })}
                        </button>
                    </div>
                )}

                {/* Recess Timer — visible to all participants */}
                {meetingState.stage === MEETING_STAGES.RECESS && (
                    <RecessTimer recessEnd={meetingState.recessEnd} />
                )}

                {/* Member Actions - for chair, wrapped in collapsible "use sparingly" section */}
                {isChair ? (
                    <details style={{ marginTop: '1rem' }}>
                        <summary>
                            {t('chair_more')}
                        </summary>
                        <div style={{
                            padding: '0.5rem 1rem 0.75rem',
                            fontSize: '0.8rem',
                            color: 'var(--h-fg-dim)',
                            fontStyle: 'italic',
                            marginBottom: '0.5rem'
                        }}>
                            {t('chair_impartial_note')}
                        </div>
                        <MemberActions
                            meetingState={meetingState}
                            currentUser={currentUser}
                            isChair={isChair}
                            onNewMotion={onNewMotion}
                            onSecondMotion={onSecondMotion}
                            onRequestToSpeak={onRequestToSpeak}
                            onFinishSpeaking={onFinishSpeaking}
                            onAmendMotion={onAmendMotion}
                            onPointOfOrder={onPointOfOrder}
                            onIncidentalMainMotion={onIncidentalMainMotion}
                            onSubsidiaryMotion={onSubsidiaryMotion}
                            onPrivilegedMotion={onPrivilegedMotion}
                            onBringBackMotion={onBringBackMotion}
                            onParliamentaryInquiry={onParliamentaryInquiry}
                            onRequestForInfo={onRequestForInfo}
                            onAppeal={onAppeal}
                            onSuspendRules={onSuspendRules}
                            onWithdrawMotion={onWithdrawMotion}
                            onDivision={onDivision}
                            onPreChairWithdraw={onPreChairWithdraw}
                            onOrdersOfTheDay={onOrdersOfTheDay}
                        />
                    </details>
                ) : (
                    <MemberActions
                        meetingState={meetingState}
                        currentUser={currentUser}
                        isChair={isChair}
                        onNewMotion={onNewMotion}
                        onSecondMotion={onSecondMotion}
                        onRequestToSpeak={onRequestToSpeak}
                        onFinishSpeaking={onFinishSpeaking}
                        onAmendMotion={onAmendMotion}
                        onPointOfOrder={onPointOfOrder}
                        onIncidentalMainMotion={onIncidentalMainMotion}
                        onSubsidiaryMotion={onSubsidiaryMotion}
                        onPrivilegedMotion={onPrivilegedMotion}
                        onBringBackMotion={onBringBackMotion}
                        onParliamentaryInquiry={onParliamentaryInquiry}
                        onRequestForInfo={onRequestForInfo}
                        onAppeal={onAppeal}
                        onSuspendRules={onSuspendRules}
                        onWithdrawMotion={onWithdrawMotion}
                        onDivision={onDivision}
                        onPreChairWithdraw={onPreChairWithdraw}
                        onOrdersOfTheDay={onOrdersOfTheDay}
                    />
                )}
            </main>
        </div>
    );
}
