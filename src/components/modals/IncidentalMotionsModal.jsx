import React from 'react';
import { useTranslation } from 'react-i18next';
import { incidentalOptions } from '../../constants';

const INCIDENTAL_INTERRUPTS = {
    'Point of Order': true,
    'Appeal the Decision of the Chair': true,
    'Parliamentary Inquiry': true,
    'Request for Information': true,
    'Division of the Assembly': true,
    'Suspend the Rules': false
};

export default function IncidentalMotionsModal({ onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>{t('incidental_motions_heading')}</h3>
                <p className="modal-intro">{t('incidental_motions_desc')}</p>
                <div className="modal-template-list">
                    {incidentalOptions.map((opt) => {
                        const interrupts = INCIDENTAL_INTERRUPTS[opt];
                        return (
                            <button
                                key={opt}
                                className="secondary modal-template-button"
                                onClick={() => onSubmit(opt)}
                            >
                                <span>{opt}</span>
                                {interrupts !== undefined && (
                                    <span className={`modal-pill ${interrupts ? 'warn' : 'ok'}`}>
                                        {interrupts ? t('incidental_motions_interrupts') : t('incidental_motions_no_interrupt')}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>{t('incidental_motions_close')}</button>
                </div>
            </div>
        </div>
    );
}

