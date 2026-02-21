import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

export default function PrivilegedMotionModal({ motionType, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [recessDuration, setRecessDuration] = useState('');
    const [fixedTime, setFixedTime] = useState('');
    const [privilegeText, setPrivilegeText] = useState('');
    const rules = getRules(motionType);

    if (!rules) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        let text = '';
        const metadata = {};

        switch (motionType) {
            case MOTION_TYPES.ADJOURN:
                text = 'to adjourn';
                break;
            case MOTION_TYPES.RECESS:
                text = `to recess for ${recessDuration || '10'} minutes`;
                metadata.recessDuration = parseInt(recessDuration, 10) || 10;
                break;
            case MOTION_TYPES.FIX_TIME_TO_ADJOURN:
                text = `to fix the time of the next meeting at ${fixedTime || 'a time to be determined'}`;
                metadata.fixedTime = fixedTime;
                break;
            case MOTION_TYPES.QUESTION_OF_PRIVILEGE:
                text = privilegeText || 'question of privilege';
                break;
            case MOTION_TYPES.ORDERS_OF_DAY:
                text = 'to call for the orders of the day';
                break;
            default:
                return;
        }

        onSubmit(motionType, text, metadata);
    };

    const getHeading = () => {
        switch (motionType) {
            case MOTION_TYPES.ADJOURN: return t('privileged_heading_adjourn');
            case MOTION_TYPES.RECESS: return t('privileged_heading_recess');
            case MOTION_TYPES.FIX_TIME_TO_ADJOURN: return t('privileged_heading_fix_time');
            case MOTION_TYPES.QUESTION_OF_PRIVILEGE: return t('privileged_heading_privilege');
            case MOTION_TYPES.ORDERS_OF_DAY: return t('privileged_heading_orders');
            default: return t('privileged_heading_default');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-privileged" onClick={(e) => e.stopPropagation()}>
                <h3>{getHeading()}</h3>
                <p className="modal-description">{t('privileged_desc')}</p>

                <RuleHintBox rules={rules} />

                <form onSubmit={handleSubmit}>
                    {motionType === MOTION_TYPES.RECESS && (
                        <div className="form-group">
                            <label>{t('privileged_recess_duration')}</label>
                            <input
                                type="number"
                                value={recessDuration}
                                onChange={(e) => setRecessDuration(e.target.value)}
                                placeholder={t('privileged_recess_placeholder')}
                                min="1"
                                autoFocus
                            />
                        </div>
                    )}

                    {motionType === MOTION_TYPES.FIX_TIME_TO_ADJOURN && (
                        <div className="form-group">
                            <label>{t('privileged_fix_time_label')}</label>
                            <input
                                type="text"
                                value={fixedTime}
                                onChange={(e) => setFixedTime(e.target.value)}
                                placeholder={t('privileged_fix_time_placeholder')}
                                autoFocus
                            />
                        </div>
                    )}

                    {motionType === MOTION_TYPES.QUESTION_OF_PRIVILEGE && (
                        <div className="form-group">
                            <label>{t('privileged_privilege_label')}</label>
                            <textarea
                                value={privilegeText}
                                onChange={(e) => setPrivilegeText(e.target.value)}
                                placeholder={t('privileged_privilege_placeholder')}
                                autoFocus
                            />
                        </div>
                    )}

                    {(motionType === MOTION_TYPES.ADJOURN || motionType === MOTION_TYPES.ORDERS_OF_DAY) && (
                        <div className="info-box">
                            {motionType === MOTION_TYPES.ADJOURN
                                ? t('privileged_adjourn_note')
                                : t('privileged_orders_note')}
                        </div>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('privileged_cancel')}</button>
                        <button type="submit">
                            {motionType === MOTION_TYPES.ORDERS_OF_DAY ? t('privileged_demand') : t('privileged_submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

