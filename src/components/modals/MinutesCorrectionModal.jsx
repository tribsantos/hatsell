import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MinutesCorrectionModal({ onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [correction, setCorrection] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!correction.trim()) return;
        onSubmit(correction);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-main" onClick={(e) => e.stopPropagation()}>
                <h3>{t('minutes_correction_heading')}</h3>
                <div className="info-box">
                    {t('minutes_correction_desc')}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('minutes_correction_label')}</label>
                        <textarea
                            value={correction}
                            onChange={(e) => setCorrection(e.target.value)}
                            placeholder={t('minutes_correction_placeholder')}
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('minutes_correction_cancel')}</button>
                        <button type="submit">{t('minutes_correction_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

