import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WithdrawMotionModal({ motionText, mover, currentUser, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const isMover = currentUser === mover;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>{t('withdraw_heading')}</h3>
                <div className="info-box">
                    {isMover ? (
                        <p>{t('withdraw_desc_mover')}</p>
                    ) : (
                        <p>{t('withdraw_desc_other')}</p>
                    )}
                </div>
                {motionText && (
                    <div className="modal-inline-note">
                        <strong>{t('withdraw_motion_label')}</strong> {motionText}
                        <div className="modal-choice-meta">{t('withdraw_mover_label')} {mover}</div>
                    </div>
                )}
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>{t('withdraw_cancel')}</button>
                    <button type="button" onClick={() => onSubmit()}>{t('withdraw_submit')}</button>
                </div>
            </div>
        </div>
    );
}

