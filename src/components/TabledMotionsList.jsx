import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TabledMotionsList({ tabledMotions, isChair, onTakeFromTable }) {
    const { t } = useTranslation('meeting');
    if (!tabledMotions || tabledMotions.length === 0) return null;

    return (
        <div className="sidebar-list">
            <h4 className="sidebar-list-title">{t('tabled_title', { count: tabledMotions.length })}</h4>
            {tabledMotions.map((item, idx) => (
                <div key={idx} className="sidebar-list-item">
                    <div>{item.mainMotionText}</div>
                    <div className="sidebar-list-meta">
                        {t('tabled_at', { time: new Date(item.tabledAt).toLocaleTimeString() })}
                    </div>
                </div>
            ))}
        </div>
    );
}
