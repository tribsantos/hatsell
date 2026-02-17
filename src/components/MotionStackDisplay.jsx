import React from 'react';
import { MOTION_STATUS } from '../constants/motionTypes';
import { getThresholdLabel } from '../engine/voteEngine';

export default function MotionStackDisplay({ motionStack, isChair }) {
    if (!motionStack || motionStack.length === 0) return null;

    const statusConfig = {
        [MOTION_STATUS.PENDING_SECOND]: { cssClass: 'pending_second', label: 'Awaiting Second' },
        [MOTION_STATUS.DEBATING]: { cssClass: 'debating', label: 'Under Debate' },
        [MOTION_STATUS.VOTING]: { cssClass: 'voting', label: 'Voting' },
    };

    return (
        <div className="panel motion-stack" aria-label="Motions on the floor">
            <h3>Motions on the Floor</h3>
            {[...motionStack].reverse().map((motion, idx) => {
                const isTop = idx === 0;
                const config = statusConfig[motion.status] || { cssClass: '', label: motion.status };
                const category = motion.category || '';

                return (
                    <div key={motion.id || idx} className={`motion-stack-item ${isTop ? 'active' : ''} ${category}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {motion.degree > 0 && (
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: '#888',
                                        textTransform: 'uppercase',
                                        fontWeight: 700
                                    }}>
                                        {motion.degree === 1 ? '1st Degree' : '2nd Degree'}
                                    </span>
                                )}
                                <span className="motion-type-label">{motion.displayName}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className={`motion-status-badge ${config.cssClass}`}>{config.label}</span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: '#666',
                                    fontWeight: 600
                                }}>
                                    {getThresholdLabel(motion.voteRequired)}
                                </span>
                            </div>
                        </div>

                        <div className="motion-text" style={{ fontSize: '0.95rem' }}>
                            {motion.text}
                        </div>

                        {motion.metadata?.amendmentHistory && motion.metadata.amendmentHistory.length > 0 && (
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(0,0,0,0.03)',
                                borderRadius: '3px',
                                fontSize: '0.8rem',
                                color: '#666'
                            }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#888', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.03em' }}>
                                    Amendment History
                                </div>
                                <div style={{ marginBottom: '0.15rem' }}>
                                    Original: "{motion.metadata.originalText}"
                                </div>
                                {motion.metadata.amendmentHistory.map((ah, ahIdx) => (
                                    <div key={ahIdx} style={{ marginBottom: '0.15rem' }}>
                                        Amendment {ahIdx + 1}: "{ah.amendmentText}"
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="motion-meta" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                            <div>Moved by: {motion.mover}</div>
                            {motion.seconder && <div>Seconded by: {motion.seconder}</div>}
                        </div>

                        {isTop && isChair && motion.status === MOTION_STATUS.PENDING_SECOND && (
                            <div className="chair-guidance" style={{ marginTop: '0.75rem', padding: '0.75rem' }}>
                                <div className="script-text" style={{ margin: 0 }}>
                                    It has been moved: "{motion.text}". Is there a second?
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
