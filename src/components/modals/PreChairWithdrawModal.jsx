import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PreChairWithdrawModal({ motionText, onWithdraw, onReformulate, onClose }) {
    const { t } = useTranslation('modals');
    const [newText, setNewText] = useState(motionText || '');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>{t('pre_withdraw_heading')}</h3>

                <div className="info-box">
                    <p>{t('pre_withdraw_desc')}</p>
                </div>

                <div className="modal-inline-note">
                    <strong>{t('pre_withdraw_motion_label')}</strong> {motionText}
                </div>

                <div className="form-group">
                    <label>{t('pre_withdraw_new_text_label')}</label>
                    <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder={t('pre_withdraw_placeholder')}
                        className="prechair-textarea"
                    />
                </div>

                <div className="modal-buttons">
                    <button type="button" onClick={onWithdraw} className="danger">{t('pre_withdraw_withdraw')}</button>
                    <button
                        type="button"
                        onClick={() => {
                            if (newText.trim() && newText.trim() !== motionText) {
                                onReformulate(newText.trim());
                            }
                        }}
                        disabled={!newText.trim() || newText.trim() === motionText}
                    >
                        {t('pre_withdraw_reformulate')}
                    </button>
                    <button type="button" onClick={onClose} className="secondary">{t('pre_withdraw_back')}</button>
                </div>
            </div>
        </div>
    );
}

