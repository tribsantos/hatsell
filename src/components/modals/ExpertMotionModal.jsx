import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const YES_NO = { YES: 'yes', NO: 'no' };

export default function ExpertMotionModal({ onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [form, setForm] = useState({
        motionText: '',
        purpose: '',
        ronrCitation: '',
        ronrMotionName: '',
        inOrderNowWhy: '',
        currentBusiness: '',
        noConflictWhy: '',
        secondRequired: YES_NO.YES,
        debatable: YES_NO.YES,
        debateLimits: '',
        amendable: YES_NO.YES,
        amendLimits: '',
        voteRequired: 'majority_votes_cast',
        noticeRequired: 'none',
        classType: 'main',
        precedence: '',
        canInterrupt: YES_NO.NO,
        precedenceRelations: '',
        reconsiderable: YES_NO.YES,
        reconsiderWhen: '',
        renewable: YES_NO.YES,
        renewableWhen: '',
        durationScope: ''
    });
    const [error, setError] = useState('');

    const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const requiredFields = [
        'motionText', 'purpose', 'ronrCitation', 'ronrMotionName', 'inOrderNowWhy', 'currentBusiness',
        'noConflictWhy', 'secondRequired', 'debatable', 'amendable', 'voteRequired', 'noticeRequired',
        'classType', 'precedence', 'precedenceRelations', 'reconsiderable', 'reconsiderWhen', 'renewable',
        'renewableWhen', 'durationScope'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const missing = requiredFields.find((key) => !String(form[key] || '').trim());
        if (missing) {
            setError(t('expert_required_error'));
            return;
        }
        const parsedPrecedence = String(form.precedence || '').trim() === ''
            ? null
            : Number(form.precedence);
        if (parsedPrecedence !== null && Number.isNaN(parsedPrecedence)) {
            setError(t('expert_precedence_number_error'));
            return;
        }

        setError('');
        onSubmit({
            ...form,
            parsedPrecedence,
            secondRequiredBool: form.secondRequired === YES_NO.YES,
            debatableBool: form.debatable === YES_NO.YES,
            amendableBool: form.amendable === YES_NO.YES,
            canInterruptBool: form.canInterrupt === YES_NO.YES,
            reconsiderableBool: form.reconsiderable === YES_NO.YES,
            renewableBool: form.renewable === YES_NO.YES
        });
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-main" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{t('expert_heading')}</h3>
                <p className="modal-description">{t('expert_desc')}</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('expert_a_motion_text')}</label>
                        <textarea value={form.motionText} onChange={(e) => setField('motionText', e.target.value)} autoFocus />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_a_purpose')}</label>
                        <textarea value={form.purpose} onChange={(e) => setField('purpose', e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>{t('expert_b_ronr_citation')}</label>
                        <input value={form.ronrCitation} onChange={(e) => setField('ronrCitation', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_b_ronr_name')}</label>
                        <input value={form.ronrMotionName} onChange={(e) => setField('ronrMotionName', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_b_in_order')}</label>
                        <textarea value={form.inOrderNowWhy} onChange={(e) => setField('inOrderNowWhy', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_b_current_business')}</label>
                        <input value={form.currentBusiness} onChange={(e) => setField('currentBusiness', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_b_no_conflict')}</label>
                        <textarea value={form.noConflictWhy} onChange={(e) => setField('noConflictWhy', e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>{t('expert_c_second')}</label>
                        <select value={form.secondRequired} onChange={(e) => setField('secondRequired', e.target.value)}>
                            <option value={YES_NO.YES}>{t('expert_yes')}</option>
                            <option value={YES_NO.NO}>{t('expert_no')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('expert_c_debatable')}</label>
                        <select value={form.debatable} onChange={(e) => setField('debatable', e.target.value)}>
                            <option value={YES_NO.YES}>{t('expert_yes')}</option>
                            <option value={YES_NO.NO}>{t('expert_no')}</option>
                        </select>
                        <input value={form.debateLimits} onChange={(e) => setField('debateLimits', e.target.value)} placeholder={t('expert_c_limits_placeholder')} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_c_amendable')}</label>
                        <select value={form.amendable} onChange={(e) => setField('amendable', e.target.value)}>
                            <option value={YES_NO.YES}>{t('expert_yes')}</option>
                            <option value={YES_NO.NO}>{t('expert_no')}</option>
                        </select>
                        <input value={form.amendLimits} onChange={(e) => setField('amendLimits', e.target.value)} placeholder={t('expert_c_limits_placeholder')} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_c_vote_required')}</label>
                        <select value={form.voteRequired} onChange={(e) => setField('voteRequired', e.target.value)}>
                            <option value="majority_votes_cast">{t('expert_vote_majority_cast')}</option>
                            <option value="two_thirds_votes_cast">{t('expert_vote_two_thirds_cast')}</option>
                            <option value="majority_entire_membership">{t('expert_vote_majority_entire')}</option>
                            <option value="majority_members_present">{t('expert_vote_majority_present')}</option>
                            <option value="two_thirds_members_present">{t('expert_vote_two_thirds_present')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('expert_c_notice')}</label>
                        <input value={form.noticeRequired} onChange={(e) => setField('noticeRequired', e.target.value)} placeholder={t('expert_c_notice_placeholder')} />
                    </div>

                    <div className="form-group">
                        <label>{t('expert_d_class')}</label>
                        <select value={form.classType} onChange={(e) => setField('classType', e.target.value)}>
                            <option value="main">{t('expert_class_main')}</option>
                            <option value="subsidiary">{t('expert_class_subsidiary')}</option>
                            <option value="privileged">{t('expert_class_privileged')}</option>
                            <option value="incidental">{t('expert_class_incidental')}</option>
                            <option value="bring_back">{t('expert_class_bring_back')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('expert_d_precedence')}</label>
                        <input value={form.precedence} onChange={(e) => setField('precedence', e.target.value)} placeholder={t('expert_d_precedence_placeholder')} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_d_interrupt')}</label>
                        <select value={form.canInterrupt} onChange={(e) => setField('canInterrupt', e.target.value)}>
                            <option value={YES_NO.NO}>{t('expert_no')}</option>
                            <option value={YES_NO.YES}>{t('expert_yes')}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('expert_d_relations')}</label>
                        <textarea value={form.precedenceRelations} onChange={(e) => setField('precedenceRelations', e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>{t('expert_e_reconsiderable')}</label>
                        <select value={form.reconsiderable} onChange={(e) => setField('reconsiderable', e.target.value)}>
                            <option value={YES_NO.YES}>{t('expert_yes')}</option>
                            <option value={YES_NO.NO}>{t('expert_no')}</option>
                        </select>
                        <input value={form.reconsiderWhen} onChange={(e) => setField('reconsiderWhen', e.target.value)} placeholder={t('expert_e_when_placeholder')} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_e_renewable')}</label>
                        <select value={form.renewable} onChange={(e) => setField('renewable', e.target.value)}>
                            <option value={YES_NO.YES}>{t('expert_yes')}</option>
                            <option value={YES_NO.NO}>{t('expert_no')}</option>
                        </select>
                        <input value={form.renewableWhen} onChange={(e) => setField('renewableWhen', e.target.value)} placeholder={t('expert_e_when_placeholder')} />
                    </div>
                    <div className="form-group">
                        <label>{t('expert_e_duration')}</label>
                        <input value={form.durationScope} onChange={(e) => setField('durationScope', e.target.value)} />
                    </div>

                    {error && <div className="info-box" style={{ color: 'var(--h-red)', marginBottom: '0.75rem' }}>{error}</div>}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('expert_cancel')}</button>
                        <button type="submit">{t('expert_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

