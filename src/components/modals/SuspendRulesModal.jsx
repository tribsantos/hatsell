import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SuspendRulesModal({ onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const TEMPLATES = [
        t('suspend_rules_purpose_nonmember'),
        t('suspend_rules_purpose_order'),
        t('suspend_rules_purpose_time'),
        t('suspend_rules_purpose_committee')
    ];
    const [customPurpose, setCustomPurpose] = useState('');

    const handleTemplate = (purpose) => {
        onSubmit(purpose);
    };

    const handleCustom = (e) => {
        e.preventDefault();
        if (!customPurpose.trim()) return;
        onSubmit(customPurpose.trim());
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-incidental" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{t('suspend_rules_heading')}</h3>
                <div className="info-box">
                    <p>{t('suspend_rules_desc')}</p>
                    <p className="modal-intro" style={{ marginBottom: '0' }}>
                        {t('suspend_rules_requirements')}
                    </p>
                </div>

                <div className="suspend-section">
                    <label className="suspend-label">
                        {t('suspend_rules_common')}
                    </label>
                    <div className="modal-template-list">
                        {TEMPLATES.map((tmpl, i) => (
                            <button
                                key={i}
                                type="button"
                                className="secondary modal-template-button"
                                onClick={() => handleTemplate(tmpl)}
                            >
                                {tmpl}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleCustom}>
                    <div className="form-group">
                        <label>{t('suspend_rules_custom')}</label>
                        <textarea
                            value={customPurpose}
                            onChange={(e) => setCustomPurpose(e.target.value)}
                            placeholder={t('suspend_rules_placeholder')}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('suspend_rules_cancel')}</button>
                        <button type="submit" disabled={!customPurpose.trim()}>{t('suspend_rules_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


