import React from 'react';
import { useTranslation } from 'react-i18next';
import { incidentalOptions } from '../../constants';

export default function IncidentalMotionsModal({ onSubmit, onClose }) {
    const { t } = useTranslation(['modals', 'motions']);
    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-incidental" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{t('modals:incidental_motions_heading')}</h3>
                <p className="modal-intro">{t('modals:incidental_motions_desc')}</p>
                <div className="modal-template-list">
                    {incidentalOptions.map((opt) => (
                        <button
                            key={opt.type}
                            className="secondary modal-template-button"
                            onClick={() => onSubmit(opt.type)}
                        >
                            <span>{t(`motions:display_${opt.type}`)}</span>
                            <span className={`modal-pill ${opt.interrupts ? 'warn' : 'ok'}`}>
                                {opt.interrupts ? t('modals:incidental_motions_interrupts') : t('modals:incidental_motions_no_interrupt')}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>{t('modals:incidental_motions_close')}</button>
                </div>
            </div>
        </div>
    );
}

