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
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="login-top-bar" aria-hidden="true" />
            <div className="login-corner-mark top-left" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M0 8V0H8" stroke="hsl(4, 62%, 30%)" strokeWidth="1" opacity="0.15" /></svg>
            </div>
            <div className="login-corner-mark top-right" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M24 8V0H16" stroke="hsl(4, 62%, 30%)" strokeWidth="1" opacity="0.15" /></svg>
            </div>
            <div className="login-corner-mark bottom-left" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M0 16V24H8" stroke="hsl(4, 62%, 30%)" strokeWidth="1" opacity="0.15" /></svg>
            </div>
            <div className="login-corner-mark bottom-right" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M24 16V24H16" stroke="hsl(4, 62%, 30%)" strokeWidth="1" opacity="0.15" /></svg>
            </div>
            <div style={{ width: '100%', maxWidth: '460px' }}>
                <header className="header">
                    <div className="logo-container">
                        <HatsellLogo />
                        <h1>Hatsell</h1>
                    </div>
                    <p className="subtitle">Parliamentary Meeting Assistant</p>
                    <span className="header-badge">Based on Robert's Rules of Order</span>
                </header>

                <div className="login-container">
                    <div className="login-section-heading">
                        <span>Join Meeting</span>
                    </div>

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
                                placeholder="e.g. Hon. Margaret Chen"
                                required
                                disabled={loading}
                                autoFocus
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Meeting Code</label>
                            <div className="login-meeting-code-row">
                                <input
                                    type="text"
                                    value={meetingCode}
                                    onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                                    placeholder="E.g. XCGJAD"
                                    disabled={loading}
                                />
                                <button type="submit" disabled={loading || !name || !meetingCode.trim()}>
                                    {loading ? 'Joining...' : 'Join →'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    <button
                        onClick={() => {
                            if (!name) {
                                setError('Please enter your name first.');
                                return;
                            }
                            onCreateMeeting(name);
                        }}
                        className="login-create-btn"
                        disabled={loading}
                    >
                        + Create a New Meeting
                    </button>
                </div>

                <footer className="login-footer">
                    <p className="login-trust-copy">
                        Hatsell runs entirely in your browser. No account required.
                        <br />
                        Meeting data is not stored on our servers.
                    </p>
                    <div className="login-footer-links">
                        {onAbout && (
                            <button type="button" onClick={onAbout}>About Hatsell</button>
                        )}
                        <span className="separator">|</span>
                        <button type="button" onClick={() => {}}>First Time?</button>
                    </div>
                    <p className="login-version">v2.1.0</p>
                </footer>
            </div>
        </div>
    );
}
