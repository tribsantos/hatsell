import React from 'react';
import { MOTION_STATUS } from '../constants/motionTypes';
import { getThresholdLabel } from '../engine/voteEngine';

export default function MotionStackDisplay({ motionStack, isChair }) {
    if (!motionStack || motionStack.length === 0) return null;

    return (
        <div className="current-motion">
            <h4>Motions on the Floor</h4>
            {/* Display from top of stack (most recent) to bottom */}
            {[...motionStack].reverse().map((motion, idx) => {
                const isTop = idx === 0;
                const stackPosition = motionStack.length - idx;
                const statusColors = {
                    [MOTION_STATUS.PENDING_SECOND]: { bg: 'rgba(230, 126, 34, 0.08)', border: '#e67e22', label: 'Awaiting Second' },
                    [MOTION_STATUS.DEBATING]: { bg: 'rgba(39, 174, 96, 0.08)', border: '#27ae60', label: 'Under Debate' },
                    [MOTION_STATUS.VOTING]: { bg: 'rgba(41, 128, 185, 0.08)', border: '#2980b9', label: 'Voting' },
                };
                const statusStyle = statusColors[motion.status] || { bg: 'transparent', border: '#666', label: motion.status };

                return (
                    <div key={motion.id} style={{
                        marginBottom: idx < motionStack.length - 1 ? '0.75rem' : 0,
                        padding: '1rem',
                        background: isTop ? statusStyle.bg : 'rgba(0,0,0,0.03)',
                        borderLeft: `4px solid ${isTop ? statusStyle.border : 'rgba(102,102,102,0.3)'}`,
                        borderRadius: '4px',
                        opacity: isTop ? 1 : 0.7
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {motion.degree > 0 && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.15rem 0.4rem',
                                        background: 'rgba(230, 126, 34, 0.1)',
                                        borderRadius: '3px',
                                        color: '#e67e22'
                                    }}>
                                        {motion.degree === 1 ? '1st Degree' : '2nd Degree'}
                                    </span>
                                )}
                                <strong style={{ color: isTop ? '#1a1a1a' : '#666', fontSize: '0.95rem' }}>
                                    {motion.displayName}
                                </strong>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '0.15rem 0.4rem',
                                    background: `${statusStyle.bg}`,
                                    border: `1px solid ${statusStyle.border}`,
                                    borderRadius: '3px',
                                    color: statusStyle.border
                                }}>
                                    {statusStyle.label}
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: '#666',
                                    padding: '0.15rem 0.4rem',
                                    background: 'rgba(0,0,0,0.05)',
                                    borderRadius: '3px'
                                }}>
                                    {getThresholdLabel(motion.voteRequired)}
                                </span>
                            </div>
                        </div>

                        <div className="motion-text" style={{ fontSize: isTop ? '1.05rem' : '0.95rem' }}>
                            {motion.text}
                        </div>

                        <div className="motion-meta" style={{ marginTop: '0.5rem' }}>
                            <div>Moved by: {motion.mover}</div>
                            {motion.seconder && <div>Seconded by: {motion.seconder}</div>}
                        </div>

                        {isTop && isChair && motion.status === MOTION_STATUS.PENDING_SECOND && (
                            <div className="info-box" style={{
                                marginTop: '0.75rem',
                                background: 'rgba(230, 126, 34, 0.08)',
                                fontSize: '0.9rem'
                            }}>
                                It has been moved: "{motion.text}". Is there a second?
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
