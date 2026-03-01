import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ChairExplanationModal({ heading, description, memberName, onConfirm, onClose }) {
    const { t } = useTranslation('modals');
    const [explanation, setExplanation] = useState('');

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-warning" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{heading}</h3>

                <div className="info-box" style={{ marginBottom: '1rem' }}>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{description}</p>
                    {memberName && (
                        <p className="sidebar-list-meta" style={{ marginTop: '0.5rem' }}>
                            {t('chair_explanation_submitted_by', { name: memberName })}
                        </p>
                    )}
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                    {t('chair_explanation_textarea_label')}
                </label>
                <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        fontFamily: 'inherit',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                    }}
                />

                <div className="modal-buttons" style={{ marginTop: '1rem' }}>
                    <button type="button" className="secondary" onClick={onClose}>
                        {t('chair_explanation_cancel')}
                    </button>
                    <button type="button" onClick={() => onConfirm(explanation)}>
                        {t('chair_explanation_confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}

