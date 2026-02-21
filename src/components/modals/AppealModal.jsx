import React from 'react';
import { useTranslation } from 'react-i18next';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

export default function AppealModal({ chairRuling, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const rules = getRules(MOTION_TYPES.APPEAL);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-appeal" onClick={(e) => e.stopPropagation()}>
                <h3>{t('appeal_heading')}</h3>
                <p className="modal-description">
                    {t('appeal_desc')}
                </p>

                <RuleHintBox rules={rules} />

                {chairRuling && (
                    <div className="warning-box">
                        <strong>{t('appeal_ruling')}</strong>
                        <p className="sidebar-list-meta" style={{ marginTop: '0.25rem' }}>{chairRuling}</p>
                    </div>
                )}

                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>{t('appeal_cancel')}</button>
                    <button type="button" onClick={() => onSubmit()}>{t('appeal_submit')}</button>
                </div>
            </div>
        </div>
    );
}

