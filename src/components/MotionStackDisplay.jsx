import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOTION_STATUS } from '../constants/motionTypes';
import { getThresholdLabel } from '../engine/voteEngine';
import { getRules } from '../engine/motionRules';

function MotionCard({ motion, isTop, isChair, defaultExpanded, stackPosition, totalInStack }) {
    const { t } = useTranslation(['meeting', 'motions']);
    const [expanded, setExpanded] = useState(defaultExpanded);

    const statusKey = {
        [MOTION_STATUS.PENDING_CHAIR]: 'status_pending_chair',
        [MOTION_STATUS.PENDING_SECOND]: 'status_pending_second',
        [MOTION_STATUS.DEBATING]: 'status_debating',
        [MOTION_STATUS.VOTING]: 'status_voting',
        [MOTION_STATUS.ADOPTED]: 'status_adopted',
        [MOTION_STATUS.DEFEATED]: 'status_defeated',
        [MOTION_STATUS.WITHDRAWN]: 'status_withdrawn',
        [MOTION_STATUS.TABLED]: 'status_tabled',
        [MOTION_STATUS.POSTPONED]: 'status_postponed',
        [MOTION_STATUS.COMMITTED]: 'status_committed',
    };

    const statusCssClass = {
        [MOTION_STATUS.PENDING_CHAIR]: 'pending_second',
        [MOTION_STATUS.PENDING_SECOND]: 'pending_second',
        [MOTION_STATUS.DEBATING]: 'debating',
        [MOTION_STATUS.VOTING]: 'voting',
        [MOTION_STATUS.ADOPTED]: 'adopted',
        [MOTION_STATUS.DEFEATED]: 'defeated',
        [MOTION_STATUS.WITHDRAWN]: 'tabled',
        [MOTION_STATUS.TABLED]: 'tabled',
        [MOTION_STATUS.POSTPONED]: 'tabled',
        [MOTION_STATUS.COMMITTED]: 'tabled',
    };

    const cssClass = statusCssClass[motion.status] || '';
    const label = statusKey[motion.status] ? t(`motions:${statusKey[motion.status]}`) : motion.status;
    const category = motion.category || '';
    const rules = getRules(motion.motionType);
    const expert = motion.metadata?.expertProcedure;
    const isExpert = motion.motionType === 'unlisted_motion' && !!expert;
    const formatExpertVoteRequired = (expertData) => {
        if (!expertData?.voteRequired) return '';
        const mapping = {
            majority: t('meeting:expert_vote_majority'),
            two_thirds: t('meeting:expert_vote_two_thirds')
        };
        const basisMapping = {
            votes_cast: t('meeting:expert_vote_basis_votes_cast'),
            members_present: t('meeting:expert_vote_basis_members_present'),
            entire_membership: t('meeting:expert_vote_basis_entire_membership')
        };
        const base = mapping[expertData.voteRequired] || expertData.voteRequired;
        const basis = expertData.voteBasisOverride ? basisMapping[expertData.voteBasisOverride] || expertData.voteBasisOverride : '';
        return basis ? `${base} (${basis})` : base;
    };
    const formatExpertClassType = (classType) => {
        const mapping = {
            main: t('meeting:category_main'),
            subsidiary: t('meeting:category_subsidiary'),
            privileged: t('meeting:category_privileged'),
            incidental: t('meeting:category_incidental'),
            bring_back: t('meeting:category_bring_back')
        };
        return mapping[classType] || classType || '';
    };

    return (
        <div className={`motion-card ${category} ${isTop ? 'active' : ''} ${expanded ? 'expanded' : ''}`}>
            <div className="motion-card-header" onClick={() => setExpanded(!expanded)}>
                <span className="motion-card-chevron">{'\u25B6'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className={`motion-status-badge ${cssClass}`}>{label}</span>
                        {isTop && totalInStack > 1 && (
                            <span style={{ fontWeight: 700, fontSize: '0.7rem', color: 'var(--h-fg)' }}>{t('meeting:highest_precedence')}</span>
                        )}
                        {!isTop && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--h-fg-dim)' }}>{t('meeting:stack_position', { position: stackPosition })}</span>
                        )}
                    </div>
                    <div style={{ marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {motion.degree > 0 && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--h-fg-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                                {motion.degree === 1 ? t('meeting:degree_1st') : t('meeting:degree_2nd')}
                            </span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--h-crimson)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.03em' }}>
                            {t(`motions:display_${motion.motionType}`, motion.displayName)}
                        </span>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="motion-card-body">
                    <div className="motion-text" style={{
                        fontSize: isTop ? '1.1rem' : '0.95rem',
                        fontFamily: isTop ? 'var(--h-font-heading)' : undefined,
                        fontStyle: isTop ? 'italic' : undefined,
                        lineHeight: 1.6
                    }}>
                        {motion.text}
                    </div>

                    {motion.metadata?.proposedText && (
                        <div className="amendment-proposed-text">
                            <div className="amendment-proposed-label">{t('meeting:amendment_proposed_label')}</div>
                            <div>"{motion.metadata.proposedText}"</div>
                        </div>
                    )}

                    <div className="motion-meta" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                        <span>{t('meeting:moved_by')} <strong>{motion.mover}</strong></span>
                        {motion.seconder && <span> &middot; {t('meeting:seconded_by')} <strong>{motion.seconder}</strong></span>}
                        {rules && <span style={{ fontStyle: 'italic', color: 'var(--h-fg-dim)' }}> &middot; {t('meeting:requires_vote', { threshold: getThresholdLabel(motion.voteRequired).toLowerCase() })}</span>}
                    </div>

                    {isExpert && (
                        <details style={{ marginTop: '0.6rem' }} open={isTop && motion.status === MOTION_STATUS.PENDING_CHAIR}>
                            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--h-blue)' }}>
                                {t('meeting:expert_dossier_title')}
                            </summary>
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                background: 'rgba(0, 0, 0, 0.03)',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                lineHeight: 1.5
                            }}>
                                <div><strong>{t('meeting:expert_a_purpose_label')}</strong> {expert.purpose}</div>
                                <div><strong>{t('meeting:expert_b_ronr_citation_label')}</strong> {expert.ronrCitation}</div>
                                <div><strong>{t('meeting:expert_b_ronr_name_label')}</strong> {expert.ronrMotionName}</div>
                                <div><strong>{t('meeting:expert_b_in_order_label')}</strong> {expert.inOrderNowWhy}</div>
                                <div><strong>{t('meeting:expert_b_current_business_label')}</strong> {expert.currentBusiness}</div>
                                <div><strong>{t('meeting:expert_b_no_conflict_label')}</strong> {expert.noConflictWhy}</div>
                                <div><strong>{t('meeting:expert_c_second_required_label')}</strong> {expert.requiresSecond ? t('meeting:yes') : t('meeting:no')}</div>
                                <div><strong>{t('meeting:expert_c_debatable_label')}</strong> {expert.isDebatable ? t('meeting:yes') : t('meeting:no')}{expert.debateLimitsText ? ` (${expert.debateLimitsText})` : ''}</div>
                                <div><strong>{t('meeting:expert_c_amendable_label')}</strong> {expert.isAmendable ? t('meeting:yes') : t('meeting:no')}{expert.amendLimitsText ? ` (${expert.amendLimitsText})` : ''}</div>
                                <div><strong>{t('meeting:expert_c_vote_required_label')}</strong> {formatExpertVoteRequired(expert)}</div>
                                <div><strong>{t('meeting:expert_c_notice_required_label')}</strong> {expert.noticeRequired}</div>
                                <div><strong>{t('meeting:expert_d_class_type_label')}</strong> {formatExpertClassType(expert.classType)}</div>
                                <div><strong>{t('meeting:expert_d_precedence_label')}</strong> {expert.precedence == null ? t('meeting:expert_not_applicable') : expert.precedence}</div>
                                <div><strong>{t('meeting:expert_d_can_interrupt_label')}</strong> {expert.canInterrupt ? t('meeting:yes') : t('meeting:no')}</div>
                                <div><strong>{t('meeting:expert_d_relations_label')}</strong> {expert.precedenceRelations}</div>
                                <div><strong>{t('meeting:expert_e_reconsiderable_label')}</strong> {expert.reconsiderable ? t('meeting:yes') : t('meeting:no')}{expert.reconsiderWhen ? ` (${expert.reconsiderWhen})` : ''}</div>
                                <div><strong>{t('meeting:expert_e_renewable_label')}</strong> {expert.renewable ? t('meeting:yes') : t('meeting:no')}{expert.renewableWhen ? ` (${expert.renewableWhen})` : ''}</div>
                                <div><strong>{t('meeting:expert_e_duration_scope_label')}</strong> {expert.durationScope}</div>
                            </div>
                        </details>
                    )}

                    {motion.metadata?.amendmentHistory && motion.metadata.amendmentHistory.length > 0 && (
                        <div style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(0,0,0,0.03)',
                            borderRadius: '3px',
                            fontSize: '0.8rem',
                            color: 'var(--h-fg-muted)'
                        }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--h-fg-dim)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.03em' }}>
                                {t('meeting:amendment_history')}
                            </div>
                            <div style={{ marginBottom: '0.15rem' }}>
                                {t('meeting:original_text', { text: motion.metadata.originalText })}
                            </div>
                            {motion.metadata.amendmentHistory.map((ah, ahIdx) => (
                                <div key={ahIdx} style={{ marginBottom: '0.25rem' }}>
                                    <div>{t('meeting:amendment_number', { number: ahIdx + 1, text: ah.amendmentText })}</div>
                                    {ah.proposedText && ah.proposedText !== ah.amendmentText && (
                                        <div>{t('meeting:amended_text_line', { text: ah.proposedText })}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {(rules || isExpert) && (
                        <div className="motion-card-properties">
                            <div className="prop-item"><strong>{getThresholdLabel(motion.voteRequired)}</strong> {t('meeting:to_adopt', { threshold: '' }).trim()}</div>
                            <div className="prop-item">{t('meeting:debatable_label')} <strong>{motion.isDebatable ? t('meeting:yes') : t('meeting:no')}</strong></div>
                            <div className="prop-item">{t('meeting:amendable_label')} <strong>{motion.isAmendable ? t('meeting:yes') : t('meeting:no')}</strong></div>
                            <div className="prop-item">{t('meeting:second_label')} <strong>{motion.requiresSecond ? t('meeting:required') : t('meeting:not_required')}</strong></div>
                        </div>
                    )}

                    {isTop && isChair && motion.status === MOTION_STATUS.PENDING_SECOND && (
                        <div className="chair-guidance" style={{ marginTop: '0.75rem', padding: '0.75rem' }}>
                            <div className="script-text" style={{ margin: 0 }}>
                                {t('meeting:chair_script_second', { text: motion.text })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MotionStackDisplay({ motionStack, isChair, decidedMotions }) {
    const { t } = useTranslation(['meeting', 'motions']);

    if ((!motionStack || motionStack.length === 0) && (!decidedMotions || decidedMotions.length === 0)) return null;

    const CATEGORY_LABELS = {
        main: t('meeting:category_main'),
        subsidiary: t('meeting:category_subsidiary'),
        privileged: t('meeting:category_privileged'),
        incidental: t('meeting:category_incidental'),
        bring_back: t('meeting:category_bring_back'),
        expert: 'Expert',
    };

    const statusKey = {
        [MOTION_STATUS.PENDING_CHAIR]: 'status_pending_chair',
        [MOTION_STATUS.PENDING_SECOND]: 'status_pending_second',
        [MOTION_STATUS.DEBATING]: 'status_debating',
        [MOTION_STATUS.VOTING]: 'status_voting',
        [MOTION_STATUS.ADOPTED]: 'status_adopted',
        [MOTION_STATUS.DEFEATED]: 'status_defeated',
        [MOTION_STATUS.WITHDRAWN]: 'status_withdrawn',
        [MOTION_STATUS.TABLED]: 'status_tabled',
        [MOTION_STATUS.POSTPONED]: 'status_postponed',
        [MOTION_STATUS.COMMITTED]: 'status_committed',
    };

    // Sort by precedence (highest first), with stack index as tiebreaker
    const sorted = motionStack && motionStack.length > 0
        ? [...motionStack].map((m, i) => ({ ...m, _stackIdx: i })).sort((a, b) => {
            const aPrec = a.precedence ?? getRules(a.motionType)?.precedence ?? 0;
            const bPrec = b.precedence ?? getRules(b.motionType)?.precedence ?? 0;
            if (bPrec !== aPrec) return bPrec - aPrec;
            return b._stackIdx - a._stackIdx;
        })
        : [];

    const activeCategories = [...new Set(sorted.map(m => m.category).filter(Boolean))];
    const hasActiveMotions = sorted.length > 0;

    return (
        <div className="panel motion-stack" aria-label={hasActiveMotions ? t('meeting:motion_stack_label') : t('meeting:decided_motions_label')}>
            {hasActiveMotions && (
                <>
                    <h3>{t('meeting:motion_stack_title', { count: sorted.length })}</h3>

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
                            stackPosition={idx + 1}
                            totalInStack={sorted.length}
                        />
                    ))}
                </>
            )}

            {decidedMotions && decidedMotions.length > 0 && (
                <details className="decided-motions-section" open={!hasActiveMotions}>
                    <summary>{t('meeting:decided_motions_title', { count: decidedMotions.length })}</summary>
                    <div>
                        {decidedMotions.map((dm, idx) => {
                            const dmLabel = statusKey[dm.status] ? t(`motions:${statusKey[dm.status]}`) : dm.status;
                            const dmCssClass = {
                                [MOTION_STATUS.ADOPTED]: 'adopted',
                                [MOTION_STATUS.DEFEATED]: 'defeated',
                                [MOTION_STATUS.WITHDRAWN]: 'tabled',
                                [MOTION_STATUS.TABLED]: 'tabled',
                                [MOTION_STATUS.POSTPONED]: 'tabled',
                                [MOTION_STATUS.COMMITTED]: 'tabled',
                            }[dm.status] || '';
                            return (
                                <div key={dm.id || idx} className="sidebar-list-item" style={{
                                    borderLeftColor: dm.status === MOTION_STATUS.ADOPTED ? 'var(--h-green)' : 'var(--h-red)',
                                    opacity: 0.8
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--h-crimson)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                            {t(`motions:display_${dm.motionType}`, dm.displayName)}
                                        </span>
                                        <span className={`motion-status-badge ${dmCssClass}`}>{dmLabel}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>{dm.text}</div>
                                    {dm.motionType === 'amend' && dm.metadata?.proposedText && dm.metadata.proposedText !== dm.text && (
                                        <div style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: 'var(--h-fg-dim)' }}>
                                            {t('meeting:amended_text_line', { text: dm.metadata.proposedText })}
                                        </div>
                                    )}
                                    <div className="sidebar-list-meta">
                                        {t('meeting:moved_by')}: {dm.mover}{dm.seconder ? ` | ${t('meeting:seconded_by')}: ${dm.seconder}` : ''}
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
