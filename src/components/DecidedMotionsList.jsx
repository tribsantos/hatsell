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
                        <div>{item.text}</div>
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
