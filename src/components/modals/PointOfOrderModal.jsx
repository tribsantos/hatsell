import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PointOfOrderModal({ onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [concern, setConcern] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!concern.trim()) return;
        onSubmit(concern);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>{t('point_of_order_heading')}</h3>
                <div className="info-box">
                    {t('point_of_order_desc')}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('point_of_order_label')}</label>
                        <textarea
                            value={concern}
                            onChange={(e) => setConcern(e.target.value)}
                            placeholder={t('point_of_order_placeholder')}
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('point_of_order_cancel')}</button>
                        <button type="submit">{t('point_of_order_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

