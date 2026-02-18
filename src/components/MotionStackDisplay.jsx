import React, { useState } from 'react';
import { MOTION_STATUS } from '../constants/motionTypes';
import { getThresholdLabel } from '../engine/voteEngine';
import { getRules } from '../engine/motionRules';

const statusConfig = {
    [MOTION_STATUS.PENDING_CHAIR]: { cssClass: 'pending_second', label: 'Pending Chair' },
    [MOTION_STATUS.PENDING_SECOND]: { cssClass: 'pending_second', label: 'Awaiting Second' },
    [MOTION_STATUS.DEBATING]: { cssClass: 'debating', label: 'Under Debate' },
    [MOTION_STATUS.VOTING]: { cssClass: 'voting', label: 'Voting' },
    [MOTION_STATUS.ADOPTED]: { cssClass: 'adopted', label: 'Adopted' },
    [MOTION_STATUS.DEFEATED]: { cssClass: 'defeated', label: 'Defeated' },
    [MOTION_STATUS.WITHDRAWN]: { cssClass: 'tabled', label: 'Withdrawn' },
    [MOTION_STATUS.TABLED]: { cssClass: 'tabled', label: 'Tabled' },
    [MOTION_STATUS.POSTPONED]: { cssClass: 'tabled', label: 'Postponed' },
    [MOTION_STATUS.COMMITTED]: { cssClass: 'tabled', label: 'Committed' },
};

const CATEGORY_LABELS = {
    main: 'Main',
    subsidiary: 'Subsidiary',
    privileged: 'Privileged',
    incidental: 'Incidental',
    bring_back: 'Bring Back',
};

function MotionCard({ motion, isTop, isChair, defaultExpanded }) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const config = statusConfig[motion.status] || { cssClass: '', label: motion.status };
    const category = motion.category || '';
    const rules = getRules(motion.motionType);

    return (
        <div className={`motion-card ${category} ${isTop ? 'active' : ''} ${expanded ? 'expanded' : ''}`}>
            <div className="motion-card-header" onClick={() => setExpanded(!expanded)}>
                <span className="motion-card-chevron">{'\u25B6'}</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
                    {motion.degree > 0 && (
                        <span style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>
                            {motion.degree === 1 ? '1st' : '2nd'}
                        </span>
                    )}
                    <span className="motion-type-label" style={{ fontSize: '0.8rem' }}>{motion.displayName}</span>
                    <span className={`motion-category-badge ${category}`}>{CATEGORY_LABELS[category] || category}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                    <span className={`motion-status-badge ${config.cssClass}`}>{config.label}</span>
                </div>
            </div>

            {expanded && (
                <div className="motion-card-body">
                    <div className="motion-text" style={{ fontSize: '0.95rem' }}>
                        {motion.text}
                    </div>

                    <div className="motion-meta" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                        <div>Moved by: {motion.mover}</div>
                        {motion.seconder && <div>Seconded by: {motion.seconder}</div>}
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

                    {rules && (
                        <div className="motion-card-properties">
                            <div className="prop-item"><strong>{getThresholdLabel(motion.voteRequired)}</strong> to adopt</div>
                            <div className="prop-item">Debatable: <strong>{rules.isDebatable ? 'Yes' : 'No'}</strong></div>
                            <div className="prop-item">Amendable: <strong>{rules.isAmendable ? 'Yes' : 'No'}</strong></div>
                            <div className="prop-item">Second: <strong>{rules.requiresSecond ? 'Required' : 'Not required'}</strong></div>
                        </div>
                    )}

                    {isTop && isChair && motion.status === MOTION_STATUS.PENDING_SECOND && (
                        <div className="chair-guidance" style={{ marginTop: '0.75rem', padding: '0.75rem' }}>
                            <div className="script-text" style={{ margin: 0 }}>
                                It has been moved: "{motion.text}". Is there a second?
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MotionStackDisplay({ motionStack, isChair, decidedMotions }) {
    if ((!motionStack || motionStack.length === 0) && (!decidedMotions || decidedMotions.length === 0)) return null;

    // Sort by precedence (highest first), with stack index as tiebreaker
    // (later on stack = higher priority when precedence is equal)
    const sorted = motionStack && motionStack.length > 0
        ? [...motionStack].map((m, i) => ({ ...m, _stackIdx: i })).sort((a, b) => {
            const aPrec = getRules(a.motionType)?.precedence ?? 0;
            const bPrec = getRules(b.motionType)?.precedence ?? 0;
            if (bPrec !== aPrec) return bPrec - aPrec;
            return b._stackIdx - a._stackIdx;
        })
        : [];

    // Determine which categories are present for the legend
    const activeCategories = [...new Set(sorted.map(m => m.category).filter(Boolean))];

    const hasActiveMotions = sorted.length > 0;

    return (
        <div className="panel motion-stack" aria-label={hasActiveMotions ? "Motions on the floor" : "Decided motions"}>
            {hasActiveMotions && (
                <>
                    <h3>Motions on the Floor</h3>

                    {activeCategories.length > 1 && (
                        <div className="motion-legend">
                            {activeCategories.map(cat => (
                                <div key={cat} className="motion-legend-item">
                                    <span className={`motion-legend-dot ${cat}`} />
                                    <span>{CATEGORY_LABELS[cat] || cat}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {sorted.map((motion, idx) => (
                        <MotionCard
                            key={motion.id || idx}
                            motion={motion}
                            isTop={idx === 0}
                            isChair={isChair}
                            defaultExpanded={idx === 0}
                        />
                    ))}
                </>
            )}

            {decidedMotions && decidedMotions.length > 0 && (
                <details className="decided-motions-section" open={!hasActiveMotions}>
                    <summary>Decided Motions ({decidedMotions.length})</summary>
                    <div>
                        {decidedMotions.map((dm, idx) => {
                            const dmConfig = statusConfig[dm.status] || { cssClass: '', label: dm.status };
                            return (
                                <div key={dm.id || idx} className="sidebar-list-item" style={{
                                    borderLeftColor: dm.status === MOTION_STATUS.ADOPTED ? 'var(--h-green)' : 'var(--h-red)',
                                    opacity: 0.8
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--h-crimson)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                            {dm.displayName}
                                        </span>
                                        <span className={`motion-status-badge ${dmConfig.cssClass}`}>{dmConfig.label}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>{dm.text}</div>
                                    <div className="sidebar-list-meta">
                                        Moved by: {dm.mover}{dm.seconder ? ` | Seconded by: ${dm.seconder}` : ''}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </details>
            )}
        </div>
    );
}
