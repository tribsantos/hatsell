import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DecidedMotionsList({ decidedMotions }) {
    const { t } = useTranslation('meeting');
    if (!decidedMotions || decidedMotions.length === 0) return null;

    return (
        <div className="sidebar-list">
            <h4 className="sidebar-list-title">{t('decided_title', { count: decidedMotions.length })}</h4>
            {decidedMotions.map((item, idx) => (
                <div key={idx} className={`sidebar-list-item ${item.result === 'adopted' ? 'adopted' : 'defeated'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div>{item.text}</div>
                            {item.motionType === 'amend' && item.metadata?.proposedText && (
                                <div style={{ marginTop: '0.2rem', color: 'var(--h-fg-dim)' }}>
                                    {t('amended_text_line', { text: item.metadata.proposedText })}
                                </div>
                            )}
                        </div>
                        <span className={`motion-status-badge ${item.result === 'adopted' ? 'adopted' : 'defeated'}`}>
                            {item.result === 'adopted' ? t('decided_adopted') : t('decided_defeated')}
                        </span>
                    </div>
                    <div className="sidebar-list-meta">{item.description}</div>
                </div>
            ))}
        </div>
    );
}
