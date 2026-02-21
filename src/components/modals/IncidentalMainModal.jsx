import React from 'react';
import { useTranslation } from 'react-i18next';
import { incidentalMainOptions } from '../../constants';

export default function IncidentalMainModal({ onSelectTemplate, onClose }) {
    const { t } = useTranslation('modals');
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-main" onClick={(e) => e.stopPropagation()}>
                <h3>{t('incidental_main_heading')}</h3>
                <p className="modal-intro">
                    {t('incidental_main_desc')}
                </p>
                <div className="modal-template-list">
                    {incidentalMainOptions.map((opt) => (
                        <button
                            key={opt.label}
                            className="secondary modal-template-button"
                            onClick={() => onSelectTemplate(opt.template, opt.heading)}
                        >
                            {opt.label}
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

