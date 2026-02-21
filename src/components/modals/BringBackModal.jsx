import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

export default function BringBackModal({ motionType, tabledMotions, decidedMotions, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const rules = getRules(motionType);

    if (!rules) return null;

    const getHeading = () => {
        switch (motionType) {
            case MOTION_TYPES.TAKE_FROM_TABLE: return t('bring_back_heading_take');
            case MOTION_TYPES.RECONSIDER: return t('bring_back_heading_reconsider');
            case MOTION_TYPES.RESCIND: return t('bring_back_heading_rescind');
            default: return t('bring_back_heading_default');
        }
    };

    const getItems = () => {
        switch (motionType) {
            case MOTION_TYPES.TAKE_FROM_TABLE:
                return (tabledMotions || []).map((tm, i) => ({
                    index: i,
                    label: tm.mainMotionText || t('bring_back_tabled'),
                    detail: `${t('bring_back_tabled_at')} ${new Date(tm.tabledAt).toLocaleTimeString()}`
                }));
            case MOTION_TYPES.RECONSIDER:
                return (decidedMotions || []).map((d, i) => ({
                    index: i,
                    label: d.text || t('bring_back_decided'),
                    detail: `${d.result === 'adopted' ? t('bring_back_adopted') : t('bring_back_defeated')} - ${d.description || ''}`
                }));
            case MOTION_TYPES.RESCIND:
                return (decidedMotions || []).filter((d) => d.result === 'adopted').map((d, i) => ({
                    index: i,
                    label: d.text || t('bring_back_adopted_motion'),
                    detail: d.description || ''
                }));
            default:
                return [];
        }
    };

    const items = getItems();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (items.length === 0) return;
        const text = motionType === MOTION_TYPES.TAKE_FROM_TABLE
            ? `to take from the table: "${items[selectedIndex]?.label}"`
            : motionType === MOTION_TYPES.RECONSIDER
                ? `to reconsider the vote on: "${items[selectedIndex]?.label}"`
                : `to rescind: "${items[selectedIndex]?.label}"`;
        onSubmit(motionType, text, { selectedIndex });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-bring_back" onClick={(e) => e.stopPropagation()}>
                <h3>{getHeading()}</h3>
                <p className="modal-description">{t('bring_back_desc')}</p>

                <RuleHintBox rules={rules} />

                {items.length === 0 ? (
                    <div className="info-box">{t('bring_back_no_items')}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('bring_back_select')}</label>
                            <div className="modal-choice-list">
                                {items.map((item) => (
                                    <label key={item.index} className={`modal-choice-item ${selectedIndex === item.index ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="bringBackItem"
                                            checked={selectedIndex === item.index}
                                            onChange={() => setSelectedIndex(item.index)}
                                            className="bringback-radio"
                                        />
                                        <div>
                                            <div>{item.label}</div>
                                            <div className="modal-choice-meta">{item.detail}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="modal-buttons">
                            <button type="button" className="secondary" onClick={onClose}>{t('bring_back_cancel')}</button>
                            <button type="submit">{t('bring_back_submit')}</button>
                        </div>
                    </form>
                )}

                {items.length === 0 && (
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('bring_back_close')}</button>
                    </div>
                )}
            </div>
        </div>
    );
}

