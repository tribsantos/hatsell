import React from 'react';

export default function MinutesApprovalSection({ currentUser, isChair, meetingState, onRequestReadMinutes, onRequestCorrection, onObjectToCorrection, onAcceptByConsent, onCallVoteOnCorrection }) {
    const hasCorrections = meetingState.minutesCorrections && meetingState.minutesCorrections.length > 0;
    const currentCorrection = hasCorrections ? meetingState.minutesCorrections[0] : null;

    return (
        <div style={{background: '#f9f8f5', padding: '2rem', borderRadius: '8px', marginBottom: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem', color: '#7b2d3b'}}>Approval of Minutes</h3>

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
                <button onClick={onRequestCorrection} className="secondary" style={{flex: 1}}>
                    Propose Correction
                </button>
            </div>
        </div>
    );
}
