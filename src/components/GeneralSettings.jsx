import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as MeetingConnection from '../services/MeetingConnection';
import HatsellLogo from './HatsellLogo';
import { AGENDA_CATEGORIES, getCategoryLabel } from '../constants/agenda';

const DEFAULT_PROFILE = {
    organizationName: '',
    totalMembership: '',
    quorumType: 'default',      // 'fixed' | 'fraction' | 'default'
    quorumValue: '',
    majorityBasis: 'votes_cast', // 'votes_cast' | 'members_present' | 'entire_membership'
    twoThirdsBasis: 'votes_cast',
    timePerSpeech: 10,           // minutes
    speechesPerMember: 2,
    totalDebateTime: '',         // minutes, optional
    meetingFormat: 'in_person',  // 'in_person' | 'electronic' | 'hybrid'
    electronicVoting: false,
    proxyVoting: false,
};

const DEFAULT_MEETING_SETTINGS = {
    meetingName: 'Regular Meeting',
    agendaItems: [],
    agendaStatus: 'guidance',
    previousNotice: {
        rescind: false,
        bylawAmendments: false,
        dischargeCommittee: false,
        disciplinary: false
    },
    meetingType: 'regular',
    specialMeetingRestrict: true,
    electronicRules: {
        recognitionMethod: 'queue_only',
        chatPolicy: 'informational_only',
        raiseHandMechanism: 'button'
    },
    openingPackage: {
        enabled: false,
        adoptAgenda: true,
        adoptElectronicRules: true
    },
    autoYieldOnTimeExpired: false,
    audioCues: false,
    showVoteDetails: false,
    language: 'en'
};


function AgendaItemForm({ initialItem, onSave, onCancel }) {
    const { t } = useTranslation('settings');
    const [item, setItem] = useState(initialItem || { title: '', category: '', owner: '', timeTarget: '', notes: '' });

    const handleSubmit = () => {
        if (!item.title.trim() || !item.category) return;
        onSave(item);
        if (!initialItem) setItem({ title: '', category: '', owner: '', timeTarget: '', notes: '' });
    };

    const fieldStyle = {
        width: '100%',
        padding: '0.4rem',
        border: '1px solid #ccc',
        borderRadius: '3px',
        fontSize: '0.85rem',
        background: '#fff'
    };

    return (
        <div style={{ padding: '0.75rem', background: '#f9f8f5', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>{t('agenda_title_label')}</label>
                    <input type="text" value={item.title} onChange={(e) => setItem(prev => ({ ...prev, title: e.target.value }))} placeholder={t('agenda_placeholder_title')} style={fieldStyle} />
                </div>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>{t('agenda_category_label')}</label>
                    <select value={item.category} onChange={(e) => setItem(prev => ({ ...prev, category: e.target.value }))} style={fieldStyle}>
                        <option value="">{t('agenda_category_placeholder')}</option>
                        {AGENDA_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>{t('agenda_owner_label')}</label>
                    <input type="text" value={item.owner} onChange={(e) => setItem(prev => ({ ...prev, owner: e.target.value }))} placeholder={t('agenda_owner_placeholder')} style={fieldStyle} />
                </div>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>{t('agenda_time_label')}</label>
                    <input type="number" value={item.timeTarget} onChange={(e) => setItem(prev => ({ ...prev, timeTarget: e.target.value }))} placeholder={t('agenda_time_placeholder')} style={fieldStyle} min="1" />
                </div>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>{t('agenda_notes_label')}</label>
                    <input type="text" value={item.notes} onChange={(e) => setItem(prev => ({ ...prev, notes: e.target.value }))} placeholder={t('agenda_notes_placeholder')} style={fieldStyle} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleSubmit} disabled={!item.title.trim() || !item.category} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    {initialItem ? t('agenda_save') : t('agenda_add')}
                </button>
                {onCancel && (
                    <button onClick={onCancel} className="secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>{t('button_cancel', { ns: 'common' })}</button>
                )}
            </div>
        </div>
    );
}

function AgendaItemRow({ item, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
    const { t } = useTranslation('settings');
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <AgendaItemForm
                initialItem={item}
                onSave={(updated) => { onUpdate(item.id, updated); setEditing(false); }}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.75rem', background: '#fff', border: '1px solid #e0e0e0',
            borderRadius: '3px', fontSize: '0.85rem'
        }}>
            <span style={{ color: '#999', fontWeight: '600', minWidth: '1.5rem' }}>{index + 1}.</span>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#888' }}>
                    {getCategoryLabel(item.category)}
                    {item.owner && ` — ${item.owner}`}
                    {item.timeTarget && ` (${item.timeTarget} min)`}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button onClick={() => onMoveUp(item.id)} disabled={index === 0} className="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>▲</button>
                <button onClick={() => onMoveDown(item.id)} disabled={index === total - 1} className="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>▼</button>
                <button onClick={() => setEditing(true)} className="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>{t('agenda_edit')}</button>
                <button onClick={() => onDelete(item.id)} className="danger" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>×</button>
            </div>
        </div>
    );
}

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function GeneralSettings({ userName, onConfirm, onCancel }) {
    const { t, i18n } = useTranslation('settings');
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [meetingSettings, setMeetingSettings] = useState({
        ...DEFAULT_MEETING_SETTINGS,
        language: i18n.language
    });
    const [generatedCodes, setGeneratedCodes] = useState(null);
    const [showAddAgenda, setShowAddAgenda] = useState(false);

    const updateProfile = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const updateMeetingSettings = (field, value) => {
        setMeetingSettings(prev => ({ ...prev, [field]: value }));
    };

    const updateMeetingSettingsPreviousNotice = (field, value) => {
        setMeetingSettings(prev => ({
            ...prev,
            previousNotice: { ...prev.previousNotice, [field]: value }
        }));
    };

    const updateElectronicRules = (field, value) => {
        setMeetingSettings(prev => ({
            ...prev,
            electronicRules: { ...prev.electronicRules, [field]: value }
        }));
    };

    const updateOpeningPackage = (field, value) => {
        setMeetingSettings(prev => ({
            ...prev,
            openingPackage: { ...prev.openingPackage, [field]: value }
        }));
    };

    const addAgendaItem = (item) => {
        setMeetingSettings(prev => ({
            ...prev,
            agendaItems: [...prev.agendaItems, { ...item, id: Date.now() }]
        }));
    };

    const updateAgendaItem = (id, updates) => {
        setMeetingSettings(prev => ({
            ...prev,
            agendaItems: prev.agendaItems.map(a => a.id === id ? { ...a, ...updates } : a)
        }));
    };

    const deleteAgendaItem = (id) => {
        setMeetingSettings(prev => ({
            ...prev,
            agendaItems: prev.agendaItems.filter(a => a.id !== id)
        }));
    };

    const reorderAgendaItem = (id, direction) => {
        setMeetingSettings(prev => {
            const items = [...prev.agendaItems];
            const idx = items.findIndex(a => a.id === id);
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (swapIdx < 0 || swapIdx >= items.length) return prev;
            [items[idx], items[swapIdx]] = [items[swapIdx], items[idx]];
            return { ...prev, agendaItems: items };
        });
    };

    const handleConfirm = () => {
        doGenerateCodes();
    };

    const doGenerateCodes = async () => {
        // Generate truly random codes for each role
        const baseCode = generateCode();
        const codes = {
            base: baseCode,
            chair: generateCode(),
            viceChair: generateCode(),
            secretary: generateCode(),
            member: generateCode()
        };

        // Ensure all codes are unique
        const allCodes = new Set([codes.base, codes.chair, codes.viceChair, codes.secretary, codes.member]);
        while (allCodes.size < 5) {
            if (allCodes.has(codes.chair)) codes.chair = generateCode();
            if (allCodes.has(codes.viceChair)) codes.viceChair = generateCode();
            if (allCodes.has(codes.secretary)) codes.secretary = generateCode();
            if (allCodes.has(codes.member)) codes.member = generateCode();
            allCodes.add(codes.chair);
            allCodes.add(codes.viceChair);
            allCodes.add(codes.secretary);
            allCodes.add(codes.member);
        }

        // Register role codes in Firebase so joiners can look them up
        try {
            await MeetingConnection.registerRoleCodes(baseCode, {
                'Chair': codes.chair,
                'Vice Chair': codes.viceChair,
                'Secretary': codes.secretary,
                'Member': codes.member
            });
        } catch (err) {
            console.error('Failed to register role codes:', err);
        }

        // Store code mappings in sessionStorage as fallback
        const codeMappings = JSON.parse(sessionStorage.getItem('hatsell_code_mappings') || '{}');
        codeMappings[codes.chair] = { role: 'Chair', baseCode };
        codeMappings[codes.viceChair] = { role: 'Vice Chair', baseCode };
        codeMappings[codes.secretary] = { role: 'Secretary', baseCode };
        codeMappings[codes.member] = { role: 'Member', baseCode };
        sessionStorage.setItem('hatsell_code_mappings', JSON.stringify(codeMappings));

        setGeneratedCodes(codes);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStartMeeting = () => {
        if (!generatedCodes) return;
        onConfirm({ profile, meetingSettings, codes: generatedCodes, userName });
    };

    const sectionStyle = {
        marginBottom: '2rem',
        padding: '1.25rem 1.25rem 1rem',
        background: 'var(--h-bg-card)',
        border: '2px solid var(--h-border)',
        boxShadow: 'var(--h-shadow)',
        borderRadius: '4px',
        borderLeft: '4px solid var(--h-red)'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.35rem',
        fontWeight: '600',
        fontSize: '0.9rem',
        color: 'var(--h-fg)'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.5rem',
        border: '2px solid var(--h-border-soft)',
        borderRadius: '3px',
        fontSize: '0.9rem',
        background: 'var(--h-bg-warm)',
        color: 'var(--h-fg)'
    };

    const radioGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        marginTop: '0.25rem'
    };

    const hintStyle = {
        fontSize: '0.78rem',
        color: 'var(--h-fg-dim)',
        fontStyle: 'italic',
        marginTop: '0.25rem'
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo-container">
                    <HatsellLogo />
                    <h1>{t('header_title')}</h1>
                </div>
                <p className="subtitle">{t('header_subtitle')}</p>
            </header>

            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '1.25rem 0.75rem' }}>

                {/* Quick Start */}
                {!generatedCodes && (
                    <div style={{
                        marginBottom: '2rem',
                        padding: '1.25rem',
                        background: 'var(--h-bg-card)',
                        border: '2px solid var(--h-border)',
                        borderRadius: '4px',
                        textAlign: 'center',
                        boxShadow: 'var(--h-shadow)'
                    }}>
                        <button
                            onClick={doGenerateCodes}
                            style={{ padding: '0.75rem 2rem', fontSize: '1rem', marginBottom: '0.5rem' }}
                        >
                            {t('quick_start')}
                        </button>
                        <div style={{ fontSize: '0.8rem', color: 'var(--h-fg-dim)' }}>
                            {t('quick_start_desc')}
                        </div>
                    </div>
                )}

                {/* Generated Codes Display */}
                {generatedCodes && (
                    <div style={{
                        marginBottom: '2rem',
                        padding: '1.5rem',
                        background: 'var(--h-green-light)',
                        border: '2px solid var(--h-green)',
                        borderRadius: '4px',
                        textAlign: 'center',
                        boxShadow: 'var(--h-shadow)'
                    }}>
                        <h3 style={{ color: 'var(--h-green-dark)', marginBottom: '1rem' }}>{t('codes_generated_title')}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--h-fg-muted)', marginBottom: '1rem' }}>
                            {t('codes_share')}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left' }}>
                            {[
                                { label: t('code_label_chair'), code: generatedCodes.chair },
                                { label: t('code_label_vice_chair'), code: generatedCodes.viceChair },
                                { label: t('code_label_secretary'), code: generatedCodes.secretary },
                                { label: t('code_label_member'), code: generatedCodes.member }
                            ].map(({ label, code }) => (
                                <div key={label} style={{
                                    padding: '0.75rem',
                                    background: 'var(--h-bg-card)',
                                    borderRadius: '3px',
                                    border: '1px solid var(--h-border-soft)'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--h-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {label}
                                    </div>
                                    <div style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '900',
                                        letterSpacing: '0.1em',
                                        color: 'var(--h-red)',
                                        fontFamily: "'Courier New', monospace"
                                    }}>
                                        {code}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
                            <button
                                onClick={() => {
                                    const text = `Chair: ${generatedCodes.chair}\nVice Chair: ${generatedCodes.viceChair}\nSecretary: ${generatedCodes.secretary}\nMember: ${generatedCodes.member}`;
                                    navigator.clipboard.writeText(text).catch(() => {});
                                }}
                                className="secondary"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                {t('copy_all_codes')}
                            </button>
                            <button
                                onClick={handleStartMeeting}
                                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                            >
                                {t('start_meeting')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Section 1: Organization Profile */}
                <div style={sectionStyle}>
                    <h3 style={{ marginBottom: '1rem', color: '#1a1a1a' }}>{t('section_org_profile')}</h3>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{t('label_org_name')}</label>
                        <input
                            type="text"
                            value={profile.organizationName}
                            onChange={(e) => updateProfile('organizationName', e.target.value)}
                            placeholder={t('placeholder_org_name')}
                            style={inputStyle}
                        />
                        <div style={hintStyle}>{t('hint_org_name')}</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{t('label_total_membership')}</label>
                        <input
                            type="number"
                            value={profile.totalMembership}
                            onChange={(e) => updateProfile('totalMembership', e.target.value)}
                            placeholder={t('placeholder_total_membership')}
                            style={inputStyle}
                            min="1"
                        />
                        <div style={hintStyle}>{t('hint_total_membership')}</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{t('label_quorum')}</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                                value={profile.quorumType}
                                onChange={(e) => updateProfile('quorumType', e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                            >
                                <option value="default">{t('quorum_default')}</option>
                                <option value="fixed">{t('quorum_fixed')}</option>
                                <option value="fraction">{t('quorum_fraction')}</option>
                            </select>
                            {(profile.quorumType === 'fixed' || profile.quorumType === 'fraction') && (
                                <input
                                    type="number"
                                    value={profile.quorumValue}
                                    onChange={(e) => updateProfile('quorumValue', e.target.value)}
                                    placeholder={profile.quorumType === 'fixed' ? t('placeholder_quorum_number') : t('placeholder_quorum_fraction')}
                                    style={{ ...inputStyle, flex: 1 }}
                                    min={profile.quorumType === 'fraction' ? '0' : '1'}
                                    max={profile.quorumType === 'fraction' ? '1' : undefined}
                                    step={profile.quorumType === 'fraction' ? '0.01' : '1'}
                                />
                            )}
                        </div>
                        <div style={hintStyle}>{t('hint_quorum')}</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{t('label_voting_basis')}</label>
                        <div className="settings-vote-grid">
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted)', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('voting_majority')}</div>
                                <div className="settings-option-group">
                                    {[
                                        { value: 'votes_cast', label: t('votes_cast'), tag: t('ronr_default') },
                                        { value: 'members_present', label: t('members_present') },
                                        { value: 'entire_membership', label: t('entire_membership') }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`settings-option ${profile.majorityBasis === opt.value ? 'selected' : ''}`}
                                            onClick={() => updateProfile('majorityBasis', opt.value)}
                                        >
                                            <span className="settings-option-dot" />
                                            <span>{opt.label}</span>
                                            {opt.tag && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--h-fg-dim)', fontStyle: 'italic' }}>{opt.tag}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted)', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('voting_two_thirds')}</div>
                                <div className="settings-option-group">
                                    {[
                                        { value: 'votes_cast', label: t('votes_cast'), tag: t('ronr_default') },
                                        { value: 'members_present', label: t('members_present') },
                                        { value: 'entire_membership', label: t('entire_membership') }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`settings-option ${profile.twoThirdsBasis === opt.value ? 'selected' : ''}`}
                                            onClick={() => updateProfile('twoThirdsBasis', opt.value)}
                                        >
                                            <span className="settings-option-dot" />
                                            <span>{opt.label}</span>
                                            {opt.tag && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--h-fg-dim)', fontStyle: 'italic' }}>{opt.tag}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={hintStyle}>{t('hint_voting_basis')}</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{t('label_debate_limits')}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>{t('label_time_per_speech')}</label>
                                <input
                                    type="number"
                                    value={profile.timePerSpeech}
                                    onChange={(e) => updateProfile('timePerSpeech', parseInt(e.target.value) || '')}
                                    style={inputStyle}
                                    min="1"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>{t('label_speeches_per_member')}</label>
                                <input
                                    type="number"
                                    value={profile.speechesPerMember}
                                    onChange={(e) => updateProfile('speechesPerMember', parseInt(e.target.value) || '')}
                                    style={inputStyle}
                                    min="1"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>{t('label_total_debate')}</label>
                                <input
                                    type="number"
                                    value={profile.totalDebateTime}
                                    onChange={(e) => updateProfile('totalDebateTime', e.target.value)}
                                    placeholder={t('placeholder_no_limit')}
                                    style={inputStyle}
                                    min="1"
                                />
                            </div>
                        </div>
                        <div style={hintStyle}>{t('hint_debate_limits')}</div>
                    </div>

                    <div className="form-group">
                        <label style={labelStyle}>{t('label_electronic_participation')}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>{t('label_meeting_format')}</label>
                                <select
                                    value={profile.meetingFormat}
                                    onChange={(e) => updateProfile('meetingFormat', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="in_person">{t('format_in_person')}</option>
                                    <option value="electronic">{t('format_electronic')}</option>
                                    <option value="hybrid">{t('format_hybrid')}</option>
                                </select>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', paddingTop: '1.25rem' }}>
                                <input
                                    type="checkbox"
                                    checked={profile.electronicVoting}
                                    onChange={(e) => updateProfile('electronicVoting', e.target.checked)}
                                />
                                {t('label_electronic_voting')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', paddingTop: '1.25rem' }}>
                                <input
                                    type="checkbox"
                                    checked={profile.proxyVoting}
                                    onChange={(e) => updateProfile('proxyVoting', e.target.checked)}
                                />
                                {t('label_proxy_voting')}
                            </label>
                        </div>
                        <div style={hintStyle}>{t('hint_electronic_participation')}</div>
                    </div>
                </div>

                {/* Section 2: Settings for this meeting */}
                <div style={{ ...sectionStyle, borderLeft: '4px solid #2980b9' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1a1a1a' }}>{t('section_meeting_settings')}</h3>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{t('label_meeting_name')}</label>
                        <input
                            type="text"
                            value={meetingSettings.meetingName}
                            onChange={(e) => updateMeetingSettings('meetingName', e.target.value)}
                            placeholder={t('placeholder_meeting_name')}
                            style={inputStyle}
                        />
                        <div style={hintStyle}>{t('hint_meeting_name')}</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>{t('label_language')}</label>
                        <select
                            value={meetingSettings.language}
                            onChange={(e) => updateMeetingSettings('language', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="en">{t('language_en')}</option>
                            <option value="pt-BR">{t('language_pt_br')}</option>
                        </select>
                        <div style={hintStyle}>{t('hint_language')}</div>
                    </div>

                    {/* A) Agenda */}
                    <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                        <label style={labelStyle}>{t('label_agenda')}</label>
                        <div style={radioGroupStyle}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="agendaStatus" value="guidance" checked={meetingSettings.agendaStatus === 'guidance'} onChange={() => updateMeetingSettings('agendaStatus', 'guidance')} />
                                {t('agenda_guidance')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="agendaStatus" value="orders_of_the_day" checked={meetingSettings.agendaStatus === 'orders_of_the_day'} onChange={() => updateMeetingSettings('agendaStatus', 'orders_of_the_day')} />
                                {t('agenda_orders')}
                            </label>
                        </div>
                        <div style={hintStyle}>
                            {meetingSettings.agendaStatus === 'guidance'
                                ? t('hint_agenda_guidance')
                                : t('hint_agenda_orders')}
                        </div>

                        {/* Agenda item list */}
                        {meetingSettings.agendaItems.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem' }}>
                                {meetingSettings.agendaItems.map((item, idx) => (
                                    <AgendaItemRow
                                        key={item.id}
                                        item={item}
                                        index={idx}
                                        total={meetingSettings.agendaItems.length}
                                        onUpdate={updateAgendaItem}
                                        onDelete={deleteAgendaItem}
                                        onMoveUp={(id) => reorderAgendaItem(id, 'up')}
                                        onMoveDown={(id) => reorderAgendaItem(id, 'down')}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Add agenda item */}
                        {showAddAgenda ? (
                            <AgendaItemForm
                                onSave={(item) => { addAgendaItem(item); setShowAddAgenda(false); }}
                                onCancel={() => setShowAddAgenda(false)}
                            />
                        ) : (
                            <button onClick={() => setShowAddAgenda(true)} className="secondary" style={{ marginTop: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                                {t('add_agenda_item')}
                            </button>
                        )}
                    </div>

                    {/* B) Previous Notice */}
                    <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                        <label style={labelStyle}>{t('label_previous_notice')}</label>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                            {t('previous_notice_desc')}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.rescind} onChange={(e) => updateMeetingSettingsPreviousNotice('rescind', e.target.checked)} />
                                {t('notice_rescind')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.bylawAmendments} onChange={(e) => updateMeetingSettingsPreviousNotice('bylawAmendments', e.target.checked)} />
                                {t('notice_bylaws')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.dischargeCommittee} onChange={(e) => updateMeetingSettingsPreviousNotice('dischargeCommittee', e.target.checked)} />
                                {t('notice_discharge')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.disciplinary} onChange={(e) => updateMeetingSettingsPreviousNotice('disciplinary', e.target.checked)} />
                                {t('notice_disciplinary')}
                            </label>
                        </div>
                        <div style={hintStyle}>{t('hint_previous_notice')}</div>
                    </div>

                    {/* C) Meeting Type */}
                    <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                        <label style={labelStyle}>{t('label_meeting_type')}</label>
                        <div style={radioGroupStyle}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="meetingType" value="regular" checked={meetingSettings.meetingType === 'regular'} onChange={() => updateMeetingSettings('meetingType', 'regular')} />
                                {t('meeting_type_regular')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="meetingType" value="special" checked={meetingSettings.meetingType === 'special'} onChange={() => updateMeetingSettings('meetingType', 'special')} />
                                {t('meeting_type_special')}
                            </label>
                        </div>
                        {meetingSettings.meetingType === 'special' && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                                <input type="checkbox" checked={meetingSettings.specialMeetingRestrict} onChange={(e) => updateMeetingSettings('specialMeetingRestrict', e.target.checked)} />
                                {t('special_restrict')}
                            </label>
                        )}
                        <div style={hintStyle}>{t('hint_meeting_type')}</div>
                    </div>

                    {/* D) Electronic Meeting Procedures */}
                    {profile.meetingFormat !== 'in_person' && (
                        <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                            <label style={labelStyle}>{t('label_electronic_procedures')}</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>{t('label_recognition_method')}</label>
                                    <select value={meetingSettings.electronicRules.recognitionMethod} onChange={(e) => updateElectronicRules('recognitionMethod', e.target.value)} style={inputStyle}>
                                        <option value="queue_only">{t('recognition_queue')}</option>
                                        <option value="chair">{t('recognition_chair')}</option>
                                        <option value="hybrid_recognition">{t('recognition_hybrid')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>{t('label_chat_policy')}</label>
                                    <select value={meetingSettings.electronicRules.chatPolicy} onChange={(e) => updateElectronicRules('chatPolicy', e.target.value)} style={inputStyle}>
                                        <option value="informational_only">{t('chat_informational')}</option>
                                        <option value="motions_allowed">{t('chat_motions')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>{t('label_raise_hand')}</label>
                                    <select value={meetingSettings.electronicRules.raiseHandMechanism} onChange={(e) => updateElectronicRules('raiseHandMechanism', e.target.value)} style={inputStyle}>
                                        <option value="button">{t('raise_hand_button')}</option>
                                        <option value="chat_keyword">{t('raise_hand_chat')}</option>
                                    </select>
                                </div>
                            </div>
                            <div style={hintStyle}>{t('hint_electronic_procedures')}</div>
                        </div>
                    )}

                    {/* E) Opening Package */}
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.75rem' }}>
                        <label style={labelStyle}>{t('label_opening_package')}</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.openingPackage.enabled} onChange={(e) => updateOpeningPackage('enabled', e.target.checked)} />
                            {t('opening_package_enable')}
                        </label>
                        {meetingSettings.openingPackage.enabled && (
                            <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    <input type="checkbox" checked={meetingSettings.openingPackage.adoptAgenda} onChange={(e) => updateOpeningPackage('adoptAgenda', e.target.checked)} />
                                    {t('opening_adopt_agenda')}
                                </label>
                                {profile.meetingFormat !== 'in_person' && (
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        <input type="checkbox" checked={meetingSettings.openingPackage.adoptElectronicRules} onChange={(e) => updateOpeningPackage('adoptElectronicRules', e.target.checked)} />
                                        {t('opening_adopt_electronic')}
                                    </label>
                                )}
                            </div>
                        )}
                        <div style={hintStyle}>{t('hint_opening_package')}</div>
                    </div>

                    {/* F) Timer Enforcement */}
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.75rem' }}>
                        <label style={labelStyle}>{t('label_timer_enforcement')}</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.autoYieldOnTimeExpired} onChange={(e) => updateMeetingSettings('autoYieldOnTimeExpired', e.target.checked)} />
                            {t('timer_auto_yield')}
                        </label>
                        <div style={hintStyle}>{t('hint_timer_enforcement')}</div>
                    </div>

                    {/* G) Audio Cues */}
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.75rem' }}>
                        <label style={labelStyle}>{t('label_audio_notifications')}</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.audioCues} onChange={(e) => updateMeetingSettings('audioCues', e.target.checked)} />
                            {t('audio_enable')}
                        </label>
                        <div style={hintStyle}>{t('hint_audio_notifications')}</div>
                    </div>

                    {/* H) Vote Transparency */}
                    <div>
                        <label style={labelStyle}>{t('label_vote_transparency')}</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.showVoteDetails} onChange={(e) => updateMeetingSettings('showVoteDetails', e.target.checked)} />
                            {t('vote_show_details')}
                        </label>
                        <div style={hintStyle}>{t('hint_vote_transparency')}</div>
                    </div>
                </div>

                {/* Action Buttons */}
                {!generatedCodes && (
                    <div style={{
                        display: 'flex', gap: '1rem', justifyContent: 'center',
                        position: 'sticky', bottom: 0, zIndex: 10,
                        padding: '1rem 0',
                        background: 'linear-gradient(to top, var(--h-bg) 60%, transparent)'
                    }}>
                        <button onClick={handleConfirm} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                            {t('button_confirm')}
                        </button>
                        <button onClick={onCancel} className="secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                            {t('button_cancel')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
