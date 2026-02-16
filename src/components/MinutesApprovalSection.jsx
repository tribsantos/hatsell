import React from 'react';

export default function MinutesApprovalSection({ currentUser, isChair, meetingState, onRequestReadMinutes, onRequestCorrection, onObjectToCorrection, onAcceptByConsent, onCallVoteOnCorrection, onReadMinutesResponse }) {
    const hasCorrections = meetingState.minutesCorrections && meetingState.minutesCorrections.length > 0;
    const currentCorrection = hasCorrections ? meetingState.minutesCorrections[0] : null;
    const correctionBlocked = hasCorrections || !!meetingState.minutesCorrectionDebate;

    return (
        <div style={{background: '#f9f8f5', padding: '2rem', borderRadius: '8px', marginBottom: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem', color: '#7b2d3b'}}>Approval of Minutes</h3>

            {/* Minutes Read Request Banner — prominent for chair */}
            {meetingState.minutesReadRequest && isChair && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.25rem',
                    background: 'rgba(52, 152, 219, 0.1)',
                    border: '2px solid #2980b9',
                    borderRadius: '4px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontWeight: '700', color: '#2980b9', marginBottom: '0.75rem', fontSize: '1rem' }}>
                        {meetingState.minutesReadRequest.requestedBy} requested the minutes to be read
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button
                            onClick={() => onReadMinutesResponse && onReadMinutesResponse(true)}
                            style={{ padding: '0.6rem 1.25rem' }}
                        >
                            Read the Minutes
                        </button>
                        <button
                            onClick={() => onReadMinutesResponse && onReadMinutesResponse(false)}
                            className="secondary"
                            style={{ padding: '0.6rem 1.25rem' }}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {meetingState.minutesCorrectionDebate && (
                <div style={{marginBottom: '1.5rem'}}>
                    <div className="warning-box" style={{marginBottom: '1rem'}}>
                        <p style={{marginBottom: '0.5rem'}}><strong>Correction Before the Assembly (Objection Raised):</strong></p>
                        <p style={{fontStyle: 'italic'}}>{meetingState.minutesCorrectionDebate.text}</p>
                        <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: '#666'}}>
                            — Proposed by {meetingState.minutesCorrectionDebate.proposedBy}
                        </p>
                    </div>

                    {isChair ? (
                        <button onClick={onCallVoteOnCorrection} style={{width: '100%'}}>
                            Call Vote on Correction
                        </button>
                    ) : (
                        <div style={{textAlign: 'center', color: '#666'}}>
                            Debate the correction, then the chair may put it to a vote.
                        </div>
                    )}
                </div>
            )}

            {currentCorrection ? (
                <div>
                    <div className="warning-box" style={{marginBottom: '1.5rem'}}>
                        <p style={{marginBottom: '0.5rem'}}><strong>Proposed Correction:</strong></p>
                        <p style={{fontStyle: 'italic'}}>{currentCorrection.text}</p>
                        <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: '#666'}}>
                            — Proposed by {currentCorrection.proposedBy}
                        </p>
                    </div>

                    {isChair && (
                        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                            <button onClick={onAcceptByConsent} style={{flex: 1}}>
                                Accept by Consent (No Objection)
                            </button>
                            <button onClick={onObjectToCorrection} className="secondary" style={{flex: 1}}>
                                Objection Raised
                            </button>
                        </div>
                    )}

                    {!isChair && (
                        <button onClick={onObjectToCorrection} className="secondary" style={{width: '100%', marginBottom: '1rem'}}>
                            I Object
                        </button>
                    )}
                </div>
            ) : (
                <div>
                    <p style={{marginBottom: '1.5rem', color: '#444'}}>
                        The minutes from the previous meeting are before the assembly for approval.
                    </p>
                </div>
            )}

            <div style={{display: 'flex', gap: '1rem'}}>
                <button onClick={onRequestReadMinutes} className="secondary" style={{flex: 1}}>
                    Request Minutes Be Read
                </button>
                <button
                    onClick={onRequestCorrection}
                    className="secondary"
                    style={{flex: 1, ...(correctionBlocked ? {opacity: 0.45} : {})}}
                    disabled={correctionBlocked}
                    data-tooltip={correctionBlocked ? 'OUT OF ORDER — A correction is already before the assembly' : 'Propose a correction to the minutes'}
                    title={correctionBlocked ? 'OUT OF ORDER — A correction is already before the assembly' : 'Propose a correction to the minutes'}
                >
                    Propose Correction
                </button>
            </div>
        </div>
    );
}
