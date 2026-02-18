import React, { useState, useEffect } from 'react';
import * as MeetingConnection from '../services/MeetingConnection';
import HatsellLogo from './HatsellLogo';

const STORAGE_KEY = 'hatsell_org_profiles';

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
    showVoteDetails: false
};

const AGENDA_CATEGORIES = [
    { value: 'informational_report', label: 'Informational / Report' },
    { value: 'general_business', label: 'General Business (Main Motion)' },
    { value: 'rescind_amend', label: 'Rescind / Amend Something Previously Adopted' },
    { value: 'bylaw_amendments', label: 'Bylaw Amendments' },
    { value: 'election', label: 'Election' },
    { value: 'disciplinary', label: 'Formal Disciplinary Procedure' },
    { value: 'financial', label: 'Financial Matters (Budget / Dues / Assessments)' }
];

function getCategoryLabel(category) {
    const found = AGENDA_CATEGORIES.find(c => c.value === category);
    return found ? found.label : category;
}

function AgendaItemForm({ initialItem, onSave, onCancel }) {
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
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>Title *</label>
                    <input type="text" value={item.title} onChange={(e) => setItem(prev => ({ ...prev, title: e.target.value }))} placeholder="Agenda item title" style={fieldStyle} />
                </div>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>Category *</label>
                    <select value={item.category} onChange={(e) => setItem(prev => ({ ...prev, category: e.target.value }))} style={fieldStyle}>
                        <option value="">Select category...</option>
                        {AGENDA_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>Owner</label>
                    <input type="text" value={item.owner} onChange={(e) => setItem(prev => ({ ...prev, owner: e.target.value }))} placeholder="Who presents" style={fieldStyle} />
                </div>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>Time target (min)</label>
                    <input type="number" value={item.timeTarget} onChange={(e) => setItem(prev => ({ ...prev, timeTarget: e.target.value }))} placeholder="Optional" style={fieldStyle} min="1" />
                </div>
                <div>
                    <label style={{ fontSize: '0.78rem', color: '#666' }}>Notes</label>
                    <input type="text" value={item.notes} onChange={(e) => setItem(prev => ({ ...prev, notes: e.target.value }))} placeholder="Optional" style={fieldStyle} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleSubmit} disabled={!item.title.trim() || !item.category} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    {initialItem ? 'Save' : 'Add Item'}
                </button>
                {onCancel && (
                    <button onClick={onCancel} className="secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Cancel</button>
                )}
            </div>
        </div>
    );
}

function AgendaItemRow({ item, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
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
                <button onClick={() => setEditing(true)} className="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>Edit</button>
                <button onClick={() => onDelete(item.id)} className="danger" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>×</button>
            </div>
        </div>
    );
}

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export default function GeneralSettings({ userName, onConfirm, onCancel }) {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [meetingSettings, setMeetingSettings] = useState(DEFAULT_MEETING_SETTINGS);
    const [savedProfileName, setSavedProfileName] = useState('');
    const [loadProfileName, setLoadProfileName] = useState('');
    const [savedNames, setSavedNames] = useState([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [generatedCodes, setGeneratedCodes] = useState(null);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [showAddAgenda, setShowAddAgenda] = useState(false);

    useEffect(() => {
        const profiles = getSavedProfiles();
        setSavedNames(Object.keys(profiles));
    }, []);

    const updateProfile = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
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

    const handleSave = () => {
        if (!savedProfileName.trim()) return;
        const profiles = getSavedProfiles();
        profiles[savedProfileName.trim()] = { ...profile, meetingSettings, savedAt: Date.now() };
        saveProfiles(profiles);
        setSavedNames(Object.keys(profiles));
        setIsDirty(false);
        setShowSaveDialog(false);
    };

    const handleLoad = () => {
        if (!loadProfileName) return;
        const profiles = getSavedProfiles();
        const loaded = profiles[loadProfileName];
        if (loaded) {
            const { savedAt, meetingCodes, previousNotice, meetingSettings: savedMeetingSettings, ...rest } = loaded;
            setProfile({ ...DEFAULT_PROFILE, ...rest });
            if (savedMeetingSettings) {
                setMeetingSettings({ ...DEFAULT_MEETING_SETTINGS, ...savedMeetingSettings });
            } else if (previousNotice) {
                // Backward compat: migrate old profiles with previousNotice in profile
                setMeetingSettings(prev => ({
                    ...prev,
                    previousNotice: { ...prev.previousNotice, ...previousNotice }
                }));
            }
            setSavedProfileName(loadProfileName);
            setIsDirty(false);
        }
    };

    const handleDeleteProfile = (name) => {
        const profiles = getSavedProfiles();
        delete profiles[name];
        saveProfiles(profiles);
        setSavedNames(Object.keys(profiles));
        if (loadProfileName === name) setLoadProfileName('');
    };

    const handleConfirm = () => {
        if (isDirty && !generatedCodes) {
            setShowUnsavedDialog(true);
            return;
        }
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

        // Also save to the profile if it was saved
        if (savedProfileName) {
            const profiles = getSavedProfiles();
            if (profiles[savedProfileName]) {
                profiles[savedProfileName].meetingCodes = codes;
                saveProfiles(profiles);
            }
        }

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
                    <h1>Hatsell</h1>
                </div>
                <p className="subtitle">General Settings</p>
            </header>

            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '1.25rem 0.75rem' }}>

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
                        <h3 style={{ color: 'var(--h-green-dark)', marginBottom: '1rem' }}>Meeting Codes Generated</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--h-fg-muted)', marginBottom: '1rem' }}>
                            Share these role-specific codes with participants:
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left' }}>
                            {[
                                { label: 'Chair', code: generatedCodes.chair },
                                { label: 'Vice Chair', code: generatedCodes.viceChair },
                                { label: 'Secretary', code: generatedCodes.secretary },
                                { label: 'Member', code: generatedCodes.member }
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
                                Copy All Codes
                            </button>
                            <button
                                onClick={handleStartMeeting}
                                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                            >
                                Start Meeting
                            </button>
                        </div>
                    </div>
                )}

                {/* Save/Load Profile Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setShowSaveDialog(true)} className="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        Save Organization Profile
                    </button>
                    {savedNames.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                                value={loadProfileName}
                                onChange={(e) => setLoadProfileName(e.target.value)}
                                aria-label="Select saved organization profile"
                                style={{ padding: '0.5rem', border: '2px solid #ddd', borderRadius: '3px', fontSize: '0.85rem', background: '#f9f8f5' }}
                            >
                                <option value="">Select profile...</option>
                                {savedNames.map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            <button onClick={handleLoad} className="secondary" disabled={!loadProfileName} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                                Load
                            </button>
                            {loadProfileName && (
                                <button onClick={() => handleDeleteProfile(loadProfileName)} className="danger" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Save Dialog */}
                {showSaveDialog && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(52, 152, 219, 0.08)',
                        border: '1px solid #2980b9',
                        borderRadius: '4px'
                    }}>
                        <label style={labelStyle}>Profile Name</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={savedProfileName}
                                onChange={(e) => setSavedProfileName(e.target.value)}
                                placeholder="e.g. My Organization"
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button onClick={handleSave} disabled={!savedProfileName.trim()} style={{ padding: '0.5rem 1rem' }}>
                                Save
                            </button>
                            <button onClick={() => setShowSaveDialog(false)} className="secondary" style={{ padding: '0.5rem 0.75rem' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Section 1: Organization Profile */}
                <div style={sectionStyle}>
                    <h3 style={{ marginBottom: '1rem', color: '#1a1a1a' }}>Organization Profile</h3>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Organization Name</label>
                        <input
                            type="text"
                            value={profile.organizationName}
                            onChange={(e) => updateProfile('organizationName', e.target.value)}
                            placeholder="e.g. Springfield Civic Association"
                            style={inputStyle}
                        />
                        <div style={hintStyle}>Appears in the top bar during the meeting and in exported minutes.</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Total Membership (optional)</label>
                        <input
                            type="number"
                            value={profile.totalMembership}
                            onChange={(e) => updateProfile('totalMembership', e.target.value)}
                            placeholder="Total number of members"
                            style={inputStyle}
                            min="1"
                        />
                        <div style={hintStyle}>Used to calculate quorum. Leave blank if unknown.</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Quorum</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                                value={profile.quorumType}
                                onChange={(e) => updateProfile('quorumType', e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                            >
                                <option value="default">Default (majority of membership)</option>
                                <option value="fixed">Fixed Number</option>
                                <option value="fraction">Fraction of Membership</option>
                            </select>
                            {(profile.quorumType === 'fixed' || profile.quorumType === 'fraction') && (
                                <input
                                    type="number"
                                    value={profile.quorumValue}
                                    onChange={(e) => updateProfile('quorumValue', e.target.value)}
                                    placeholder={profile.quorumType === 'fixed' ? 'Number' : 'e.g. 0.5'}
                                    style={{ ...inputStyle, flex: 1 }}
                                    min={profile.quorumType === 'fraction' ? '0' : '1'}
                                    max={profile.quorumType === 'fraction' ? '1' : undefined}
                                    step={profile.quorumType === 'fraction' ? '0.01' : '1'}
                                />
                            )}
                        </div>
                        <div style={hintStyle}>Default quorum is a majority of the total membership (RONR).</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Voting Basis</label>
                        <div className="settings-vote-grid">
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted)', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Majority</div>
                                <div className="settings-option-group">
                                    {[
                                        { value: 'votes_cast', label: 'Votes cast', tag: 'RONR default' },
                                        { value: 'members_present', label: 'Members present' },
                                        { value: 'entire_membership', label: 'Entire membership' }
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
                                <div style={{ fontSize: '0.8rem', color: 'var(--h-fg-muted)', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Two-Thirds</div>
                                <div className="settings-option-group">
                                    {[
                                        { value: 'votes_cast', label: 'Votes cast', tag: 'RONR default' },
                                        { value: 'members_present', label: 'Members present' },
                                        { value: 'entire_membership', label: 'Entire membership' }
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
                        <div style={hintStyle}>How votes are counted for each threshold type. RONR default counts only votes actually cast.</div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Debate Limits</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Time per speech (min)</label>
                                <input
                                    type="number"
                                    value={profile.timePerSpeech}
                                    onChange={(e) => updateProfile('timePerSpeech', parseInt(e.target.value) || '')}
                                    style={inputStyle}
                                    min="1"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Speeches per member</label>
                                <input
                                    type="number"
                                    value={profile.speechesPerMember}
                                    onChange={(e) => updateProfile('speechesPerMember', parseInt(e.target.value) || '')}
                                    style={inputStyle}
                                    min="1"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Total debate (min, opt.)</label>
                                <input
                                    type="number"
                                    value={profile.totalDebateTime}
                                    onChange={(e) => updateProfile('totalDebateTime', e.target.value)}
                                    placeholder="No limit"
                                    style={inputStyle}
                                    min="1"
                                />
                            </div>
                        </div>
                        <div style={hintStyle}>Leave total debate blank for no limit.</div>
                    </div>

                    <div className="form-group">
                        <label style={labelStyle}>Electronic Participation</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Meeting Format</label>
                                <select
                                    value={profile.meetingFormat}
                                    onChange={(e) => updateProfile('meetingFormat', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="in_person">In Person</option>
                                    <option value="electronic">Fully Electronic</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', paddingTop: '1.25rem' }}>
                                <input
                                    type="checkbox"
                                    checked={profile.electronicVoting}
                                    onChange={(e) => updateProfile('electronicVoting', e.target.checked)}
                                />
                                Electronic Voting
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', paddingTop: '1.25rem' }}>
                                <input
                                    type="checkbox"
                                    checked={profile.proxyVoting}
                                    onChange={(e) => updateProfile('proxyVoting', e.target.checked)}
                                />
                                Proxy Voting
                            </label>
                        </div>
                        <div style={hintStyle}>Electronic and proxy voting must be authorized in your bylaws.</div>
                    </div>
                </div>

                {/* Section 2: Settings for this meeting */}
                <div style={{ ...sectionStyle, borderLeft: '4px solid #2980b9' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1a1a1a' }}>Settings for this meeting</h3>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Meeting Name</label>
                        <input
                            type="text"
                            value={meetingSettings.meetingName}
                            onChange={(e) => updateMeetingSettings('meetingName', e.target.value)}
                            placeholder="e.g. Regular Meeting, Annual Meeting"
                            style={inputStyle}
                        />
                        <div style={hintStyle}>Displayed in the top bar and used in minutes export.</div>
                    </div>

                    {/* A) Agenda */}
                    <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                        <label style={labelStyle}>Agenda</label>
                        <div style={radioGroupStyle}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="agendaStatus" value="guidance" checked={meetingSettings.agendaStatus === 'guidance'} onChange={() => updateMeetingSettings('agendaStatus', 'guidance')} />
                                Guidance only (chair reference)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="agendaStatus" value="orders_of_the_day" checked={meetingSettings.agendaStatus === 'orders_of_the_day'} onChange={() => updateMeetingSettings('agendaStatus', 'orders_of_the_day')} />
                                Orders of the Day (adopted agenda)
                            </label>
                        </div>
                        <div style={hintStyle}>
                            {meetingSettings.agendaStatus === 'guidance'
                                ? 'Items listed here will guide the chair but are not binding.'
                                : 'Items will be treated as adopted orders; deviating requires suspending the rules.'}
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
                                + Add Agenda Item
                            </button>
                        )}
                    </div>

                    {/* B) Previous Notice */}
                    <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                        <label style={labelStyle}>Previous Notice</label>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                            Check items for which previous notice has been given:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.rescind} onChange={(e) => updateMeetingSettingsPreviousNotice('rescind', e.target.checked)} />
                                Rescind / Amend Something Previously Adopted
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.bylawAmendments} onChange={(e) => updateMeetingSettingsPreviousNotice('bylawAmendments', e.target.checked)} />
                                Bylaw Amendments
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.dischargeCommittee} onChange={(e) => updateMeetingSettingsPreviousNotice('dischargeCommittee', e.target.checked)} />
                                Discharge a Committee
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={meetingSettings.previousNotice.disciplinary} onChange={(e) => updateMeetingSettingsPreviousNotice('disciplinary', e.target.checked)} />
                                Formal Disciplinary Procedure
                            </label>
                        </div>
                        <div style={hintStyle}>Checking these indicates notice was given, lowering the required vote to a majority.</div>
                    </div>

                    {/* C) Meeting Type */}
                    <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                        <label style={labelStyle}>Meeting Type</label>
                        <div style={radioGroupStyle}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="meetingType" value="regular" checked={meetingSettings.meetingType === 'regular'} onChange={() => updateMeetingSettings('meetingType', 'regular')} />
                                Regular Meeting
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="radio" name="meetingType" value="special" checked={meetingSettings.meetingType === 'special'} onChange={() => updateMeetingSettings('meetingType', 'special')} />
                                Special Meeting
                            </label>
                        </div>
                        {meetingSettings.meetingType === 'special' && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                                <input type="checkbox" checked={meetingSettings.specialMeetingRestrict} onChange={(e) => updateMeetingSettings('specialMeetingRestrict', e.target.checked)} />
                                Restrict business to items specified in the call
                            </label>
                        )}
                        <div style={hintStyle}>Special meetings may only consider business mentioned in the call (RONR).</div>
                    </div>

                    {/* D) Electronic Meeting Procedures */}
                    {profile.meetingFormat !== 'in_person' && (
                        <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                            <label style={labelStyle}>Electronic Meeting Procedures</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Recognition Method</label>
                                    <select value={meetingSettings.electronicRules.recognitionMethod} onChange={(e) => updateElectronicRules('recognitionMethod', e.target.value)} style={inputStyle}>
                                        <option value="queue_only">Queue Only</option>
                                        <option value="chair">Chair Recognizes</option>
                                        <option value="hybrid_recognition">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Chat Policy</label>
                                    <select value={meetingSettings.electronicRules.chatPolicy} onChange={(e) => updateElectronicRules('chatPolicy', e.target.value)} style={inputStyle}>
                                        <option value="informational_only">Informational Only</option>
                                        <option value="motions_allowed">Motions Allowed</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Raise Hand Mechanism</label>
                                    <select value={meetingSettings.electronicRules.raiseHandMechanism} onChange={(e) => updateElectronicRules('raiseHandMechanism', e.target.value)} style={inputStyle}>
                                        <option value="button">Button</option>
                                        <option value="chat_keyword">Chat Keyword</option>
                                    </select>
                                </div>
                            </div>
                            <div style={hintStyle}>Configure how electronic participation is managed during this meeting.</div>
                        </div>
                    )}

                    {/* E) Opening Package */}
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.75rem' }}>
                        <label style={labelStyle}>Opening Package</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.openingPackage.enabled} onChange={(e) => updateOpeningPackage('enabled', e.target.checked)} />
                            Propose bundled adoption of opening items
                        </label>
                        {meetingSettings.openingPackage.enabled && (
                            <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    <input type="checkbox" checked={meetingSettings.openingPackage.adoptAgenda} onChange={(e) => updateOpeningPackage('adoptAgenda', e.target.checked)} />
                                    Adopt the agenda
                                </label>
                                {profile.meetingFormat !== 'in_person' && (
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        <input type="checkbox" checked={meetingSettings.openingPackage.adoptElectronicRules} onChange={(e) => updateOpeningPackage('adoptElectronicRules', e.target.checked)} />
                                        Adopt electronic meeting rules
                                    </label>
                                )}
                            </div>
                        )}
                        <div style={hintStyle}>If enabled, the chair will be prompted to propose adopting these items together at the start of the meeting.</div>
                    </div>

                    {/* F) Timer Enforcement */}
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.75rem' }}>
                        <label style={labelStyle}>Timer Enforcement</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.autoYieldOnTimeExpired} onChange={(e) => updateMeetingSettings('autoYieldOnTimeExpired', e.target.checked)} />
                            Automatically yield the floor when speaking time expires
                        </label>
                        <div style={hintStyle}>If enabled, the speaker's floor is automatically yielded when the time limit is reached. Otherwise, the timer continues running past zero and the chair may allow the speaker to finish.</div>
                    </div>

                    {/* G) Audio Cues */}
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.75rem' }}>
                        <label style={labelStyle}>Audio Notifications</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.audioCues} onChange={(e) => updateMeetingSettings('audioCues', e.target.checked)} />
                            Enable audio cues for key meeting events
                        </label>
                        <div style={hintStyle}>Plays brief tones when voting opens, speaking time expires, motions are seconded, and other important events occur.</div>
                    </div>

                    {/* H) Vote Transparency */}
                    <div>
                        <label style={labelStyle}>Vote Transparency</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={meetingSettings.showVoteDetails} onChange={(e) => updateMeetingSettings('showVoteDetails', e.target.checked)} />
                            Display individual votes when results are announced
                        </label>
                        <div style={hintStyle}>When enabled, the chair will see how each member voted (by name) in the result announcement. By default, only aggregate totals are shown.</div>
                    </div>
                </div>

                {/* Unsaved dialog */}
                {showUnsavedDialog && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'var(--h-bg-card)', padding: '2rem', borderRadius: '4px',
                            border: '2px solid var(--h-border)',
                            boxShadow: 'var(--h-shadow-lg)',
                            maxWidth: '400px', width: '90%', textAlign: 'center'
                        }}>
                            <h3 style={{ marginBottom: '1rem' }}>Unsaved Profile</h3>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--h-fg-muted)' }}>
                                Your organization profile has not been saved. Would you like to save it?
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button onClick={() => { setShowUnsavedDialog(false); doGenerateCodes(); }} className="secondary">
                                    Continue Without Saving
                                </button>
                                <button onClick={() => { setShowUnsavedDialog(false); setShowSaveDialog(true); }}>
                                    Save First
                                </button>
                                <button onClick={() => setShowUnsavedDialog(false)} className="secondary">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {!generatedCodes && (
                    <div style={{
                        display: 'flex', gap: '1rem', justifyContent: 'center',
                        position: 'sticky', bottom: 0, zIndex: 10,
                        padding: '1rem 0',
                        background: 'linear-gradient(to top, var(--h-bg) 60%, transparent)'
                    }}>
                        <button onClick={handleConfirm} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                            Confirm
                        </button>
                        <button onClick={onCancel} className="secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
