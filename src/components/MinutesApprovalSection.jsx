import React from 'react';

export default function MinutesApprovalSection({ currentUser, isChair, meetingState, onRequestReadMinutes, onRequestCorrection, onObjectToCorrection, onAcceptByConsent, onCallVoteOnCorrection, onReadMinutesResponse }) {
  const hasCorrections = meetingState.minutesCorrections && meetingState.minutesCorrections.length > 0;
  const currentCorrection = hasCorrections ? meetingState.minutesCorrections[0] : null;
  const correctionBlocked = hasCorrections || !!meetingState.minutesCorrectionDebate;

  return (
    <section className="panel" aria-label="Minutes approval">
      <h3>Approval of Minutes</h3>

      {/* Minutes Read Request Banner */}
      {meetingState.minutesReadRequest && isChair && (
        <div className="warning-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontWeight: 600 }}>
            {meetingState.minutesReadRequest.requestedBy}{' requested the minutes to be read'}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => onReadMinutesResponse && onReadMinutesResponse(true)} style={{ padding: '0.5rem 1rem' }}>
              Read the Minutes
            </button>
            <button type="button" onClick={() => onReadMinutesResponse && onReadMinutesResponse(false)} className="secondary" style={{ padding: '0.5rem 1rem' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Correction debate in progress */}
      {meetingState.minutesCorrectionDebate && (
        <div className="warning-box">
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Correction Before the Assembly (Objection Raised):</p>
          <p style={{ fontStyle: 'italic', marginBottom: '0.25rem' }}>{meetingState.minutesCorrectionDebate.text}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted, #666)' }}>
            {'\u2014 Proposed by '}{meetingState.minutesCorrectionDebate.proposedBy}
          </p>
          {isChair ? (
            <button type="button" onClick={onCallVoteOnCorrection} style={{ marginTop: '0.75rem' }}>
              Call Vote on Correction
            </button>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--h-fg-muted, #666)', marginTop: '0.5rem' }}>
              Debate the correction, then the chair may put it to a vote.
            </p>
          )}
        </div>
      )}

      {/* Current pending correction */}
      {currentCorrection ? (
        <div className="info-box">
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Proposed Correction:</p>
          <p style={{ fontStyle: 'italic', marginBottom: '0.25rem' }}>{currentCorrection.text}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted, #666)' }}>
            {'\u2014 Proposed by '}{currentCorrection.proposedBy}
          </p>
          {isChair && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button type="button" onClick={onAcceptByConsent} className="success">
                Accept by Consent (No Objection)
              </button>
              <button type="button" onClick={onObjectToCorrection} className="secondary">
                Objection Raised
              </button>
            </div>
          )}
          {!isChair && (
            <button type="button" onClick={onObjectToCorrection} className="secondary" style={{ marginTop: '0.75rem' }}>
              I Object
            </button>
          )}
        </div>
      ) : (
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--h-fg-muted, #666)' }}>
            The minutes from the previous meeting are before the assembly for approval.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button type="button" onClick={onRequestReadMinutes} className="secondary" style={{ flex: 1 }}>
          Request Minutes Be Read
        </button>
        <button type="button" onClick={onRequestCorrection} className="secondary" disabled={correctionBlocked} style={{ flex: 1 }}>
          Propose Correction
        </button>
      </div>
    </section>
  );
}
