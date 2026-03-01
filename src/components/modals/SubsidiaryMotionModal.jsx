import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

const getSubsidiaryFields = (t) => ({
    [MOTION_TYPES.AMEND]: {
        heading: t('subsidiary_heading_amend'),
        textLabel: t('subsidiary_amendment_text'),
        textPlaceholder: t('subsidiary_amendment_placeholder'),
        showOriginal: true
    },
    [MOTION_TYPES.POSTPONE_INDEFINITELY]: {
        heading: t('subsidiary_heading_postpone_indef'),
        textLabel: t('subsidiary_reason_label'),
        textPlaceholder: t('subsidiary_postpone_indef_text'),
        defaultText: t('subsidiary_postpone_indef_motion')
    },
    [MOTION_TYPES.COMMIT]: {
        heading: t('subsidiary_heading_commit'),
        noTextInput: true,
        fixedText: t('subsidiary_commit_motion'),
        extraFields: ['committeeName', 'instructions']
    },
    [MOTION_TYPES.POSTPONE_DEFINITELY]: {
        heading: t('subsidiary_heading_postpone_def'),
        noTextInput: true,
        fixedText: t('subsidiary_postpone_def_motion'),
        extraFields: ['postponeTime']
    },
    [MOTION_TYPES.LIMIT_DEBATE]: {
        heading: t('subsidiary_heading_limit_debate'),
        noTextInput: true,
        fixedText: t('subsidiary_limit_debate_motion'),
        extraFields: ['timeLimit', 'speechLimit']
    },
    [MOTION_TYPES.PREVIOUS_QUESTION]: {
        heading: t('subsidiary_heading_previous_question'),
        textLabel: null,
        defaultText: t('subsidiary_previous_question_motion'),
        noTextInput: true
    },
    [MOTION_TYPES.LAY_ON_TABLE]: {
        heading: t('subsidiary_heading_lay_on_table'),
        textLabel: null,
        defaultText: t('subsidiary_lay_on_table_motion'),
        noTextInput: true
    }
});

export default function SubsidiaryMotionModal({ motionType, currentMotionText, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
    const config = getSubsidiaryFields(t)[motionType];
    const rules = getRules(motionType);

    const [text, setText] = useState(config?.defaultText || '');
    const [committeeName, setCommitteeName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [postponeTime, setPostponeTime] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [speechLimit, setSpeechLimit] = useState('');

    if (!config || !rules) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        let motionText = text;
        const metadata = {};

        if (motionType === MOTION_TYPES.COMMIT) {
            motionText = `to refer to ${committeeName || 'a committee'}${instructions ? ` with instructions to ${instructions}` : ''}`;
            metadata.committeeName = committeeName;
            metadata.instructions = instructions;
        } else if (motionType === MOTION_TYPES.POSTPONE_DEFINITELY) {
            motionText = `to postpone until ${postponeTime || 'a later time'}`;
            metadata.postponeTime = postponeTime;
        } else if (motionType === MOTION_TYPES.LIMIT_DEBATE) {
            const parts = [];
            if (timeLimit) parts.push(`${timeLimit} minutes per speaker`);
            if (speechLimit) parts.push(`${speechLimit} speeches per member`);
            motionText = `to limit debate to ${parts.join(' and ') || 'specified limits'}`;
            metadata.debateLimits = {};
            if (timeLimit) metadata.debateLimits.maxSpeechDuration = parseInt(timeLimit, 10);
            if (speechLimit) metadata.debateLimits.maxSpeechesPerMember = parseInt(speechLimit, 10);
        }

        if (!motionText.trim() && !config.noTextInput) return;
        onSubmit(motionType, motionText || config.defaultText, metadata);
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-subsidiary" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{config.heading}</h3>
                <p className="modal-description">{t('subsidiary_desc')}</p>

                <RuleHintBox rules={rules} />

                {config.showOriginal && currentMotionText && (
                    <div className="info-box">
                        <strong>{t('subsidiary_pending_question')}</strong><br />
                        {currentMotionText}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!config.noTextInput && (
                        <div className="form-group">
                            <label>{config.textLabel}</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={config.textPlaceholder}
                                autoFocus
                            />
                        </div>
                    )}

                    {config.noTextInput && (
                        <div className="info-box">
                            <p>Motion: "{config.fixedText || config.defaultText}"</p>
                        </div>
                    )}

                    {motionType === MOTION_TYPES.COMMIT && (
                        <>
                            <div className="form-group">
                                <label>{t('subsidiary_committee_name')}</label>
                                <input
                                    type="text"
                                    value={committeeName}
                                    onChange={(e) => setCommitteeName(e.target.value)}
                                    placeholder={t('subsidiary_committee_placeholder')}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('subsidiary_instructions_label')}</label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder={t('subsidiary_instructions_placeholder')}
                                />
                            </div>
                        </>
                    )}

                    {motionType === MOTION_TYPES.POSTPONE_DEFINITELY && (
                        <div className="form-group">
                            <label>{t('subsidiary_postpone_until')}</label>
                            <input
                                type="text"
                                value={postponeTime}
                                onChange={(e) => setPostponeTime(e.target.value)}
                                placeholder={t('subsidiary_postpone_placeholder')}
                            />
                        </div>
                    )}

                    {motionType === MOTION_TYPES.LIMIT_DEBATE && (
                        <>
                            <div className="form-group">
                                <label>{t('subsidiary_time_limit')}</label>
                                <input
                                    type="number"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(e.target.value)}
                                    placeholder={t('subsidiary_time_placeholder')}
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('subsidiary_max_speeches')}</label>
                                <input
                                    type="number"
                                    value={speechLimit}
                                    onChange={(e) => setSpeechLimit(e.target.value)}
                                    placeholder={t('subsidiary_max_placeholder')}
                                    min="1"
                                />
                            </div>
                        </>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>{t('subsidiary_cancel')}</button>
                        <button type="submit">{t('subsidiary_submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


