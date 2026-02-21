import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { specialOriginalOptions } from '../../constants';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

export default function MotionModal({ heading, initialText = '', showSpecialOptions = true, previousNotice, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const [motionText, setMotionText] = useState(initialText || '');
    const mainRules = getRules(MOTION_TYPES.MAIN);

    useEffect(() => {
        setMotionText(initialText || '');
    }, [initialText]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!motionText.trim()) return;
        onSubmit(motionText);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-main" onClick={(e) => e.stopPropagation()}>
                <h3>{heading || t('motion_heading')}</h3>
                <p className="modal-description">{t('motion_desc')}</p>

                <RuleHintBox rules={mainRules} />

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('motion_label')}</label>
                        <textarea
                            value={motionText}
                            onChange={(e) => setMotionText(e.target.value)}
                            placeholder={t('motion_placeholder')}
                            autoFocus
                        />
                    </div>

                    {showSpecialOptions && (
                        <>
                            <p className="modal-intro" style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                                {t('motion_special_types')}
                            </p>
                            <div className="modal-template-list">
                                {specialOriginalOptions.map((opt) => {
                                    const needsNotice = opt.requiresNotice && (!previousNotice || !previousNotice[opt.requiresNotice]);
                                    return (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            className="secondary modal-template-button"
                                            onClick={() => !needsNotice && setMotionText(opt.template)}
                                            disabled={needsNotice}
                                            style={needsNotice ? { opacity: 0.45 } : {}}
                                            data-tooltip={needsNotice ? t('motion_previous_notice') : ''}
                                            title={needsNotice ? t('motion_previous_notice') : ''}
                                        >
                                            <span>{opt.label}</span>
                                            {needsNotice && (
                                                <span className="modal-choice-meta" style={{ color: 'var(--h-red)', fontStyle: 'italic' }}>
                                                    ({t('motion_previous_notice_tag')})
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('motion_cancel')}</button>
                        <button type="submit">{t('motion_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

