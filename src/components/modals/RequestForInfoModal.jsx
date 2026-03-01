import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function RequestForInfoModal({ onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!question.trim()) return;
        onSubmit(question);
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-incidental" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{t('request_info_heading')}</h3>
                <div className="info-box">
                    {t('request_info_desc')}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('request_info_label')}</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={t('request_info_placeholder')}
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('request_info_cancel')}</button>
                        <button type="submit">{t('request_info_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


