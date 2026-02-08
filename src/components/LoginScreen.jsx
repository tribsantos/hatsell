import React, { useState } from 'react';
import { ROLES, MEETING_STAGES } from '../constants';
import * as MeetingConnection from '../services/MeetingConnection';

export default function LoginScreen({ onLogin }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState(ROLES.PRESIDENT);
    const [meetingCode, setMeetingCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;

        onLogin({
            name,
            role,
            meetingCode: meetingCode.trim() || (role === ROLES.PRESIDENT ? Math.random().toString(36).substring(7).toUpperCase() : null)
        });
    };

    const handleClearMeeting = () => {
        if (confirm('Clear the existing meeting data and start fresh?')) {
            MeetingConnection.clearState();
            window.location.reload();
        }
    };

    const existingMeeting = MeetingConnection.getState();
    const hasPresident = existingMeeting?.participants?.some(p => p.role === ROLES.PRESIDENT);
    const isStale = existingMeeting && !hasPresident;

    return (
        <div className="app-container">
            <header className="header">
                <h1>Hatsell</h1>
                <p className="subtitle">Based on Robert's Rules of Order</p>
            </header>

            <div className="login-container">
                <h2>{existingMeeting && existingMeeting.stage !== MEETING_STAGES.ADJOURNED ? 'Join Meeting' : 'Start Meeting'}</h2>

                {isStale && (
                    <div className="warning-box" style={{marginBottom: '1.5rem'}}>
                        <strong>Stale Meeting Detected</strong><br />
                        The President has left and there is no quorum. The meeting has been automatically adjourned.
                        <button
                            onClick={handleClearMeeting}
                            style={{marginTop: '1rem', width: '100%'}}
                            className="danger"
                        >
                            Clear Meeting Data
                        </button>
                    </div>
                )}

                {existingMeeting && existingMeeting.stage !== MEETING_STAGES.ADJOURNED && hasPresident && (
                    <div className="info-box" style={{marginBottom: '1.5rem'}}>
                        A meeting is currently in progress with {existingMeeting.participants.length} participant(s).
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            {Object.values(ROLES).map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Meeting Code {role === ROLES.PRESIDENT ? '(optional - auto-generated if blank)' : '(optional)'}</label>
                        <input
                            type="text"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                            placeholder="Enter meeting code"
                        />
                    </div>

                    {role === ROLES.PRESIDENT && existingMeeting && existingMeeting.stage !== MEETING_STAGES.ADJOURNED && hasPresident && (
                        <div className="warning-box">
                            Warning: Starting as President will create a new meeting and clear the existing one.
                        </div>
                    )}

                    <button type="submit" disabled={isStale && role !== ROLES.PRESIDENT}>
                        {role === ROLES.PRESIDENT ? 'Start Meeting' : 'Join Meeting'}
                    </button>

                    {!isStale && existingMeeting && existingMeeting.stage !== MEETING_STAGES.ADJOURNED && (
                        <button
                            type="button"
                            onClick={handleClearMeeting}
                            style={{marginTop: '1rem', width: '100%'}}
                            className="secondary"
                        >
                            Clear Meeting Data
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
