import React from 'react';
import { useTranslation } from 'react-i18next';
import DrawerOverlay from '../DrawerOverlay';

export default function QueueDrawer({ meetingState, onClose }) {
    const { t } = useTranslation('meeting');
    const currentSpeaker = meetingState.currentSpeaker;
    const queue = meetingState.speakingQueue || [];

    return (
        <DrawerOverlay title={t('drawer_speaking_queue')} onClose={onClose}>
            {currentSpeaker && (
                <div className="info-box" style={{ marginBottom: '1rem' }}>
                    <strong>{t('drawer_currently_speaking')}</strong><br />
                    {currentSpeaker.participant}
                    {' '}
                    <span className={`stance-badge ${currentSpeaker.stance}`}>
                        {currentSpeaker.stance}
                    </span>
                </div>
            )}

            {queue.length === 0 && !currentSpeaker && (
                <p style={{ color: 'var(--h-fg-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    {t('drawer_queue_empty')}
                </p>
            )}

            <ul className="speaking-queue">
                {queue.map((item, idx) => (
                    <li key={idx} className={`queue-item ${item.stance}`}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>{item.participant}</span>
                                {item.hasSpokenBefore && (
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t('drawer_repeat')}</span>
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
        </DrawerOverlay>
    );
}
