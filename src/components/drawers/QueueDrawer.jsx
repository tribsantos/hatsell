import React from 'react';
import DrawerOverlay from '../DrawerOverlay';

export default function QueueDrawer({ meetingState, onClose }) {
    const currentSpeaker = meetingState.currentSpeaker;
    const queue = meetingState.speakingQueue || [];

    return (
        <DrawerOverlay title="Speaking Queue" onClose={onClose}>
            {currentSpeaker && (
                <div className="info-box" style={{ marginBottom: '1rem' }}>
                    <strong>Currently Speaking:</strong><br />
                    {currentSpeaker.participant}
                    {' '}
                    <span className={`stance-badge ${currentSpeaker.stance}`}>
                        {currentSpeaker.stance}
                    </span>
                </div>
            )}

            {queue.length === 0 && !currentSpeaker && (
                <p style={{ color: 'var(--h-fg-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No one in the speaking queue.
                </p>
            )}

            <ul className="speaking-queue">
                {queue.map((item, idx) => (
                    <li key={idx} className={`queue-item ${item.stance}`}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>{item.participant}</span>
                                {item.hasSpokenBefore && (
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>(repeat)</span>
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
