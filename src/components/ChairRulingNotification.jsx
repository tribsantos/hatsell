import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const RULING_TYPE_LABELS = {
    point_of_order: 'ruling_notification_type_point',
    ruled_out_of_order: 'ruling_notification_type_motion',
    correction_returned: 'ruling_notification_type_correction',
    request_dismissed: 'ruling_notification_type_dismiss'
};

export default function ChairRulingNotification({ meetingState, isChair, onAppeal }) {
    const { t } = useTranslation('meeting');
    const [visible, setVisible] = useState(false);
    const [ruling, setRuling] = useState(null);
    const lastTimestampRef = useRef(null);
    const stageRef = useRef(meetingState.stage);
    const stackLenRef = useRef((meetingState.motionStack || []).length);

    // Show when a new negative ruling appears (non-chair only)
    useEffect(() => {
        const lr = meetingState.lastChairRuling;
        if (!lr || isChair) return;

        // Only negative rulings
        const isNegative = lr.ruling === 'not_sustained' ||
            lr.ruling === 'out_of_order' ||
            lr.ruling === 'returned' ||
            lr.ruling === 'dismissed';

        if (isNegative && lr.timestamp && lr.timestamp !== lastTimestampRef.current) {
            lastTimestampRef.current = lr.timestamp;
            setRuling(lr);
            setVisible(true);
        }
    }, [meetingState.lastChairRuling, isChair]);

    // Auto-dismiss when business advances (stage change or stack length change)
    useEffect(() => {
        const newStage = meetingState.stage;
        const newStackLen = (meetingState.motionStack || []).length;

        if (visible && (newStage !== stageRef.current || newStackLen !== stackLenRef.current)) {
            setVisible(false);
        }

        stageRef.current = newStage;
        stackLenRef.current = newStackLen;
    }, [meetingState.stage, meetingState.motionStack, visible]);

    if (!visible || !ruling) return null;

    const typeKey = RULING_TYPE_LABELS[ruling.type] || 'ruling_notification_type_motion';

    return (
        <div className="modal-overlay" style={{ zIndex: 900 }}>
            <div className="modal variant-warning" onClick={(e) => e.stopPropagation()}>
                <h3>{t('ruling_notification_title')}</h3>

                <div style={{
                    background: 'var(--bg-warning, #fff3cd)',
                    border: '1px solid var(--border-warning, #ffc107)',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem'
                }}>
                    <strong>{t(typeKey)}</strong>
                    {ruling.concern && (
                        <p style={{ margin: '0.5rem 0 0', whiteSpace: 'pre-wrap' }}>{ruling.concern}</p>
                    )}
                    {ruling.raisedBy && (
                        <p className="sidebar-list-meta" style={{ marginTop: '0.25rem' }}>
                            {t('ruling_notification_affected', { name: ruling.raisedBy })}
                        </p>
                    )}
                </div>

                {ruling.explanation && (
                    <div className="info-box" style={{ marginBottom: '1rem' }}>
                        <strong>{t('ruling_notification_explanation')}</strong>
                        <p style={{ margin: '0.25rem 0 0', whiteSpace: 'pre-wrap' }}>{ruling.explanation}</p>
                    </div>
                )}

                <div className="modal-buttons">
                    <button type="button" onClick={() => {
                        setVisible(false);
                        onAppeal();
                    }}>
                        {t('ruling_notification_appeal')}
                    </button>
                    <button type="button" className="secondary" onClick={() => setVisible(false)}>
                        {t('ruling_notification_ok')}
                    </button>
                </div>
            </div>
        </div>
    );
}
