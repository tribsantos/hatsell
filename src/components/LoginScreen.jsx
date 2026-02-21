import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROLES } from '../constants';
import * as MeetingConnection from '../services/MeetingConnection';
import HatsellLogo from './HatsellLogo';

export default function LoginScreen({ onLogin, onAbout, onTutorial, onCreateMeeting }) {
    const { t, i18n } = useTranslation(['login', 'common']);
    const [name, setName] = useState('');
    const [meetingCode, setMeetingCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('join');

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR';
        i18n.changeLanguage(newLang);
        localStorage.setItem('hatsell_language', newLang);
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!name) return;

        const code = meetingCode.trim();
        if (!code) {
            setError(t('login:error_code_required'));
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
                setError(t('login:error_no_meeting'));
                setLoading(false);
                return;
            }

            await onLogin({ name, role, meetingCode: actualCode });
        } catch (err) {
            setError(t('login:error_join_failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        if (!name) {
            setError(t('login:error_name_required'));
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
                        <h1>{t('common:app_name')}</h1>
                    </div>
                    <p className="subtitle">{t('common:app_subtitle')}</p>
                </header>

                {/* Tab toggle */}
                <div className="login-tabs">
                    <button
                        className={`login-tab ${activeTab === 'join' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('join'); setError(null); }}
                    >
                        {t('login:tab_join')}
                    </button>
                    <button
                        className={`login-tab ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('create'); setError(null); }}
                    >
                        {t('login:tab_create')}
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
                            <label className="login-label">{t('login:label_your_name')}</label>
                            <input
                                type="text"
                                className="login-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('login:placeholder_name')}
                                required
                                disabled={loading}
                                autoFocus
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="login-label">{t('login:label_meeting_code')}</label>
                            <input
                                type="text"
                                className="login-input"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                                placeholder={t('login:placeholder_code')}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading || !name || !meetingCode.trim()}
                        >
                            {loading ? t('login:button_joining') : t('login:button_join')}
                        </button>
                    </form>
                )}

                {activeTab === 'create' && (
                    <div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="login-label">{t('login:label_your_name')}</label>
                            <input
                                type="text"
                                className="login-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('login:placeholder_name')}
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
                            {t('login:button_create')}
                        </button>
                    </div>
                )}

                <div style={{ textAlign: 'center' }}>
                    <span className="header-badge">{t('common:based_on_ronr')}</span>
                </div>

                <footer className="login-footer">
                    <p className="login-trust-copy">
                        {t('login:trust_copy_line1')}
                        <br />
                        {t('login:trust_copy_line2')}
                    </p>
                    <div className="login-footer-links">
                        {onAbout && (
                            <button type="button" onClick={onAbout}>{t('login:link_about')}</button>
                        )}
                        {onAbout && onTutorial && <span className="separator">|</span>}
                        {onTutorial && (
                            <button type="button" onClick={onTutorial}>{t('login:link_tutorial')}</button>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            padding: '0.25rem 0.5rem',
                            marginTop: '0.25rem'
                        }}
                    >
                        {t('login:language_toggle')}
                    </button>
                    <p className="login-version">{t('common:label_version')}</p>
                </footer>
            </div>
        </div>
    );
}
