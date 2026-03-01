import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MinutesApprovalSection({ currentUser, isChair, meetingState, onRequestReadMinutes, onRequestCorrection, onObjectToCorrection, onAcceptByConsent, onCallVoteOnCorrection, onReadMinutesResponse, onRecognizeCorrection, onReturnCorrection }) {
  const { t } = useTranslation('meeting');
  const hasCorrections = meetingState.minutesCorrections && meetingState.minutesCorrections.length > 0;
  const currentCorrection = hasCorrections ? meetingState.minutesCorrections[0] : null;
  const correctionBlocked = hasCorrections || !!meetingState.minutesCorrectionDebate;

  return (
    <section className="panel" aria-label="Minutes approval">
      <h3>{t('minutes_title')}</h3>

      {/* Minutes Read Request Banner */}
      {meetingState.minutesReadRequest && isChair && (
        <div className="warning-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontWeight: 600 }}>
            {t('minutes_read_request', { name: meetingState.minutesReadRequest.requestedBy })}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => onReadMinutesResponse && onReadMinutesResponse(true)} style={{ padding: '0.5rem 1rem' }}>
              {t('minutes_read_button')}
            </button>
            <button type="button" onClick={() => onReadMinutesResponse && onReadMinutesResponse(false)} className="secondary" style={{ padding: '0.5rem 1rem' }}>
              {t('minutes_dismiss_button')}
            </button>
          </div>
        </div>
      )}

      {/* Correction debate in progress */}
      {meetingState.minutesCorrectionDebate && (
        <div className="warning-box">
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{t('minutes_correction_debate')}</p>
          <p style={{ fontStyle: 'italic', marginBottom: '0.25rem' }}>{meetingState.minutesCorrectionDebate.text}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted, #666)' }}>
            {t('minutes_proposed_by', { name: meetingState.minutesCorrectionDebate.proposedBy })}
          </p>
          {isChair ? (
            <button type="button" onClick={onCallVoteOnCorrection} style={{ marginTop: '0.75rem' }}>
              {t('minutes_call_vote_correction')}
            </button>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--h-fg-muted, #666)', marginTop: '0.5rem' }}>
              {t('minutes_debate_note')}
            </p>
          )}
        </div>
      )}

      {/* Current pending correction */}
      {currentCorrection ? (
        <div className="info-box">
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{t('minutes_proposed_correction')}</p>
          <p style={{ fontStyle: 'italic', marginBottom: '0.25rem' }}>{currentCorrection.text}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted, #666)' }}>
            {t('minutes_proposed_by', { name: currentCorrection.proposedBy })}
          </p>
          {currentCorrection.status === 'pending_chair' ? (
            <>
              {isChair ? (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button type="button" onClick={onRecognizeCorrection} className="success">
                    {t('minutes_recognize_correction')}
                  </button>
                  <button type="button" onClick={onReturnCorrection} className="secondary">
                    {t('minutes_return_correction')}
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--h-fg-muted, #666)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  {t('minutes_awaiting_chair')}
                </p>
              )}
            </>
          ) : (
            <>
              {isChair && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button type="button" onClick={onAcceptByConsent} className="success">
                    {t('minutes_accept_consent')}
                  </button>
                  <button type="button" onClick={onObjectToCorrection} className="secondary">
                    {t('minutes_objection_raised')}
                  </button>
                </div>
              )}
              {!isChair && (
                <button type="button" onClick={onObjectToCorrection} className="secondary" style={{ marginTop: '0.75rem' }}>
                  {t('minutes_i_object')}
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--h-fg-muted, #666)' }}>
            {t('minutes_before_assembly')}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button type="button" onClick={onRequestReadMinutes} className="secondary" style={{ flex: 1 }}>
          {t('minutes_request_read')}
        </button>
        <button type="button" onClick={onRequestCorrection} className="secondary" disabled={correctionBlocked} style={{ flex: 1 }}>
          {t('minutes_propose_correction')}
        </button>
      </div>
    </section>
  );
}
