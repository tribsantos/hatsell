import React from 'react';
import { MEETING_STAGES } from '../../constants';
import DrawerOverlay from '../DrawerOverlay';
import { exportMinutes } from '../../services/minutesExport';

export default function LogDrawer({ meetingState, onClose }) {
    const log = meetingState.log || [];
    const isAdjourned = meetingState.stage === MEETING_STAGES.ADJOURNED;

    return (
        <DrawerOverlay title="Meeting Log" onClose={onClose}>
            {isAdjourned && (
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={() => exportMinutes(meetingState)}
                        className="secondary"
                        style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        data-tooltip="Download formal minutes as an editable Word document"
                        title="Download formal minutes as an editable Word document"
                    >
                        Export Minutes (.docx)
                    </button>
                </div>
            )}

            {log.length === 0 && (
                <p style={{ color: 'var(--h-fg-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No log entries yet.
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
