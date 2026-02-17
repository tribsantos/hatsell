import React, { useState } from 'react';
import { ROLES } from '../constants';
import * as MeetingConnection from '../services/MeetingConnection';
import HatsellLogo from './HatsellLogo';

export default function LoginScreen({ onLogin, onAbout, onCreateMeeting }) {
    const [name, setName] = useState('');
    const [meetingCode, setMeetingCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!name) return;

        const code = meetingCode.trim();
        if (!code) {
            setError('Meeting code is required to join a meeting.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            let role = ROLES.MEMBER;
            let actualCode = code;

            // First, try Firebase role code lookup
            const lookup = await MeetingConnection.lookupCode(code);
            if (lookup) {
                // Found a role-specific code in Firebase
                actualCode = lookup.meetingCode;
                // Map role string to ROLES constant
                if (lookup.role === 'Chair') role = ROLES.PRESIDENT;
                else if (lookup.role === 'Vice Chair') role = ROLES.VICE_PRESIDENT;
                else if (lookup.role === 'Secretary') role = ROLES.SECRETARY;
                else role = ROLES.MEMBER;
            } else {
                // Fall back to session/local storage code mappings
                const codeMappings = JSON.parse(sessionStorage.getItem('hatsell_code_mappings') || '{}');
                if (codeMappings[code]) {
                    if (codeMappings[code].role === 'Chair') role = ROLES.PRESIDENT;
                    else if (codeMappings[code].role === 'Vice Chair') role = ROLES.VICE_PRESIDENT;
                    else if (codeMappings[code].role === 'Secretary') role = ROLES.SECRETARY;
                    else role = ROLES.MEMBER;
                    actualCode = codeMappings[code].baseCode;
                } else {
                    // Check saved profiles in localStorage
                    const profiles = JSON.parse(localStorage.getItem('hatsell_org_profiles') || '{}');
                    const allMeetings = Object.values(profiles).flatMap(p => p.meetingCodes ? [p.meetingCodes] : []);
                    for (const codes of allMeetings) {
                        if (codes.chair === code) { role = ROLES.PRESIDENT; actualCode = codes.base; break; }
                        if (codes.viceChair === code) { role = ROLES.VICE_PRESIDENT; actualCode = codes.base; break; }
                        if (codes.secretary === code) { role = ROLES.SECRETARY; actualCode = codes.base; break; }
                        if (codes.member === code) { role = ROLES.MEMBER; actualCode = codes.base; break; }
                    }
                }
            }

            // Verify the meeting exists with the resolved base code
            const exists = await MeetingConnection.checkMeetingExists(actualCode);
            if (!exists) {
                setError('No meeting found with that code. Check the code and try again.');
                setLoading(false);
                return;
            }

            await onLogin({ name, role, meetingCode: actualCode });
        } catch (err) {
            setError('Failed to join meeting. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo-container">
                    <HatsellLogo />
                    <h1>Hatsell</h1>
                </div>
                <p className="subtitle">Based on Robert's Rules of Order</p>
                {onAbout && (
                    <div style={{ marginTop: '0.75rem' }}>
                        <button type="button" onClick={onAbout} className="ghost">
                            About
                        </button>
                    </div>
                )}
            </header>

            <div className="login-container">
                {error && (
                    <div className="login-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleJoin}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Meeting Code</label>
                        <div className="login-meeting-code-row">
                            <input
                                type="text"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                                placeholder="Enter meeting code"
                                disabled={loading}
                                style={{ textTransform: 'uppercase' }}
                            />
                            <button type="submit" disabled={loading || !name || !meetingCode.trim()}>
                                {loading ? 'Joining...' : 'Join'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="login-divider">
                    <span>or</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            if (!name) {
                                setError('Please enter your name first.');
                                return;
                            }
                            onCreateMeeting(name);
                        }}
                        className="secondary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        Create a New Meeting
                    </button>
                </div>

                <p className="login-trust-copy">
                    No account required. Meeting data is stored securely and cleared when the session ends.
                </p>
            </div>
        </div>
    );
}
