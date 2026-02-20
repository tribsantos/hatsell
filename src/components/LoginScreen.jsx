import React, { useState } from 'react';
import { ROLES } from '../constants';
import * as MeetingConnection from '../services/MeetingConnection';
import HatsellLogo from './HatsellLogo';

export default function LoginScreen({ onLogin, onAbout, onTutorial, onCreateMeeting }) {
    const [name, setName] = useState('');
    const [meetingCode, setMeetingCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('join');

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
                // Fall back to session storage code mappings
                const codeMappings = JSON.parse(sessionStorage.getItem('hatsell_code_mappings') || '{}');
                if (codeMappings[code]) {
                    if (codeMappings[code].role === 'Chair') role = ROLES.PRESIDENT;
                    else if (codeMappings[code].role === 'Vice Chair') role = ROLES.VICE_PRESIDENT;
                    else if (codeMappings[code].role === 'Secretary') role = ROLES.SECRETARY;
                    else role = ROLES.MEMBER;
                    actualCode = codeMappings[code].baseCode;
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

    const handleCreate = () => {
        if (!name) {
            setError('Please enter your name first.');
            return;
        }
        onCreateMeeting(name);
    };

    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '0 1rem' }}>
                <header className="header">
                    <div className="logo-container">
                        <HatsellLogo />
                        <h1>Hatsell</h1>
                    </div>
                    <p className="subtitle">Parliamentary Meeting Assistant</p>
                </header>

                {/* Tab toggle */}
                <div className="login-tabs">
                    <button
                        className={`login-tab ${activeTab === 'join' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('join'); setError(null); }}
                    >
                        Join Meeting
                    </button>
                    <button
                        className={`login-tab ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('create'); setError(null); }}
                    >
                        Create Meeting
                    </button>
                </div>

                {error && (
                    <div className="login-error" role="alert">
                        {error}
                    </div>
                )}

                {activeTab === 'join' && (
                    <form onSubmit={handleJoin}>
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="login-label">Your Name</label>
                            <input
                                type="text"
                                className="login-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Hatsell"
                                required
                                disabled={loading}
                                autoFocus
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="login-label">Meeting Code</label>
                            <input
                                type="text"
                                className="login-input"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                                placeholder="e.g. XKGLS"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading || !name || !meetingCode.trim()}
                        >
                            {loading ? 'Joining...' : 'Join Meeting'}
                        </button>
                    </form>
                )}

                {activeTab === 'create' && (
                    <div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="login-label">Your Name</label>
                            <input
                                type="text"
                                className="login-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Hatsell"
                                required
                                disabled={loading}
                                autoComplete="name"
                            />
                        </div>

                        <button
                            type="button"
                            className="login-submit"
                            onClick={handleCreate}
                            disabled={loading || !name}
                        >
                            Create Meeting
                        </button>
                    </div>
                )}

                <div style={{ textAlign: 'center' }}>
                    <span className="header-badge">Based on Robert's Rules of Order</span>
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
                        {onAbout && onTutorial && <span className="separator">|</span>}
                        {onTutorial && (
                            <button type="button" onClick={onTutorial}>First Time?</button>
                        )}
                    </div>
                    <p className="login-version">v2.1.0</p>
                </footer>
            </div>
        </div>
    );
}
