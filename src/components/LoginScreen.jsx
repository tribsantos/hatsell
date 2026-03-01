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

            const lookup = await MeetingConnection.lookupCode(code);
            if (lookup) {
                actualCode = lookup.meetingCode;
                if (lookup.role === 'Chair') role = ROLES.PRESIDENT;
                else if (lookup.role === 'Vice Chair') role = ROLES.VICE_PRESIDENT;
                else if (lookup.role === 'Secretary') role = ROLES.SECRETARY;
                else role = ROLES.MEMBER;
            } else {
                const codeMappings = JSON.parse(sessionStorage.getItem('hatsell_code_mappings') || '{}');
                if (codeMappings[code]) {
                    if (codeMappings[code].role === 'Chair') role = ROLES.PRESIDENT;
                    else if (codeMappings[code].role === 'Vice Chair') role = ROLES.VICE_PRESIDENT;
                    else if (codeMappings[code].role === 'Secretary') role = ROLES.SECRETARY;
                    else role = ROLES.MEMBER;
                    actualCode = codeMappings[code].baseCode;
                }
            }

            const exists = await MeetingConnection.checkMeetingExists(actualCode);
            if (!exists) {
                setError(t('login:error_no_meeting'));
                setLoading(false);
                return;
            }

            const result = await onLogin({ name, role, meetingCode: actualCode });
            if (result && result.ok === false) {
                setError(result.error || t('login:error_join_failed'));
                setLoading(false);
                return;
            }
        } catch (err) {
            setError(err?.message || t('login:error_join_failed'));
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
        <div className="app-container login-shell">
            <div className="login-top-bar" />

            <div className="login-corner-mark top-left">
                <svg width="24" height="24"><path d="M0 24V0h24" fill="none" stroke="var(--h-red)" strokeWidth="2" opacity="0.3" /></svg>
            </div>
            <div className="login-corner-mark top-right">
                <svg width="24" height="24"><path d="M24 24V0H0" fill="none" stroke="var(--h-red)" strokeWidth="2" opacity="0.3" /></svg>
            </div>
            <div className="login-corner-mark bottom-left">
                <svg width="24" height="24"><path d="M0 0v24h24" fill="none" stroke="var(--h-red)" strokeWidth="2" opacity="0.3" /></svg>
            </div>
            <div className="login-corner-mark bottom-right">
                <svg width="24" height="24"><path d="M24 0v24H0" fill="none" stroke="var(--h-red)" strokeWidth="2" opacity="0.3" /></svg>
            </div>

            <div className="login-shell-inner">
                <section className="login-brand-panel">
                    <header className="header">
                        <div className="logo-container">
                            <HatsellLogo />
                            <h1>{t('common:app_name')}</h1>
                        </div>
                        <p className="subtitle">{t('common:app_subtitle')}</p>
                    </header>
                    <p className="login-brand-copy">
                        {t('login:trust_copy_line1')}
                        <br />
                        {t('login:trust_copy_line2')}
                    </p>
                    <span className="header-badge">{t('common:based_on_ronr')}</span>
                </section>

                <section className="login-form-panel">
                    <div className="login-container">
                        <div className="login-section-heading">
                            <span>{t('login:tab_join')}</span>
                        </div>

                        {error && (
                            <div className="login-error" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleJoin}>
                            <div className="form-group">
                                <label>{t('login:label_your_name')}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('login:placeholder_name')}
                                    required
                                    disabled={loading}
                                    autoFocus
                                    autoComplete="name"
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('login:label_meeting_code')}</label>
                                <div className="login-meeting-code-row">
                                    <input
                                        type="text"
                                        value={meetingCode}
                                        onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                                        placeholder={t('login:placeholder_code')}
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !name || !meetingCode.trim()}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {loading ? t('login:button_joining') : t('login:button_join')} {'\u2192'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="login-divider">{t('login:divider_or', 'or')}</div>

                        <button
                            type="button"
                            className="login-create-btn"
                            onClick={handleCreate}
                            disabled={loading || !name}
                        >
                            + {t('login:button_create')}
                        </button>
                    </div>

                    <footer className="login-footer">
                        <div className="login-footer-links">
                            {onAbout && (
                                <button type="button" onClick={onAbout}>{t('login:link_about')}</button>
                            )}
                            {onAbout && onTutorial && <span className="separator">|</span>}
                            {onTutorial && (
                                <button type="button" onClick={onTutorial}>{t('login:link_tutorial')}</button>
                            )}
                        </div>
                        <div className="login-footer-links" style={{ marginTop: '0.25rem' }}>
                            <button type="button" onClick={toggleLanguage}>
                                {t('login:language_toggle')}
                            </button>
                        </div>
                        <p className="login-version">{t('common:label_version')}</p>
                    </footer>
                </section>
            </div>
        </div>
    );
}
