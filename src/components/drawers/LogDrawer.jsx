import React from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES } from '../../constants';
import DrawerOverlay from '../DrawerOverlay';
import { exportMinutes } from '../../services/minutesExport';

export default function LogDrawer({ meetingState, onClose }) {
    const { t } = useTranslation('meeting');
    const log = meetingState.log || [];
    const isAdjourned = meetingState.stage === MEETING_STAGES.ADJOURNED;

    return (
        <DrawerOverlay title={t('drawer_meeting_log')} onClose={onClose}>
            {isAdjourned && (
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={() => exportMinutes(meetingState)}
                        className="secondary"
                        style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        data-tooltip={t('drawer_export_minutes_tooltip')}
                        title={t('drawer_export_minutes_tooltip')}
                    >
                        {t('drawer_export_minutes')}
                    </button>
                </div>
            )}

            {log.length === 0 && (
                <p style={{ color: 'var(--h-fg-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    {t('drawer_log_empty')}
                </p>
            )}

            <div className="meeting-log" style={{ maxHeight: 'none' }}>
                {log.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="log-entry">
                        <div className="log-timestamp">{entry.timestamp}</div>
                        <div>{entry.message}</div>
                    </div>
                ))}
            </div>
        </DrawerOverlay>
    );
}
