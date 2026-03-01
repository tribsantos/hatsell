import React from 'react';
import { useTranslation } from 'react-i18next';
import { incidentalMainOptions } from '../../constants';

export default function IncidentalMainModal({ onSelectTemplate, onClose }) {
    const { t } = useTranslation('modals');
    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-main" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{t('incidental_main_heading')}</h3>
                <p className="modal-intro">
                    {t('incidental_main_desc')}
                </p>
                <div className="modal-template-list">
                    {incidentalMainOptions.map((opt) => (
                        <button
                            key={opt.key}
                            className="secondary modal-template-button"
                            onClick={() => onSelectTemplate(t(`${opt.key}_template`), t('incidental_main_heading'))}
                        >
                            {t(`${opt.key}_label`)}
                        </button>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>
                        {t('incidental_main_close')}
                    </button>
                </div>
            </div>
        </div>
    );
}


