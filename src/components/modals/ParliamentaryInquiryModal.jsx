import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ParliamentaryInquiryModal({ onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [inquiry, setInquiry] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inquiry.trim()) return;
        onSubmit(inquiry);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>{t('parl_inquiry_heading')}</h3>
                <div className="info-box">
                    {t('parl_inquiry_desc')}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('parl_inquiry_label')}</label>
                        <textarea
                            value={inquiry}
                            onChange={(e) => setInquiry(e.target.value)}
                            placeholder={t('parl_inquiry_placeholder')}
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('parl_inquiry_cancel')}</button>
                        <button type="submit">{t('parl_inquiry_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

