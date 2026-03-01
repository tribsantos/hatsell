import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DivideQuestionModal({ currentMotionText, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [partsText, setPartsText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const parts = partsText
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean);
        if (parts.length < 2) return;
        onSubmit(parts);
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-incidental" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{t('divide_question_heading')}</h3>
                <p className="modal-description">{t('divide_question_desc')}</p>

                {currentMotionText && (
                    <div className="info-box" style={{ marginBottom: '0.75rem' }}>
                        <strong>{t('divide_question_pending_label')}</strong><br />
                        {currentMotionText}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('divide_question_parts_label')}</label>
                        <textarea
                            value={partsText}
                            onChange={(e) => setPartsText(e.target.value)}
                            placeholder={t('divide_question_parts_placeholder')}
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('divide_question_cancel')}</button>
                        <button type="submit">{t('divide_question_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


