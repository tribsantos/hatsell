import React, { useState } from 'react';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

const SUBSIDIARY_FIELDS = {
    [MOTION_TYPES.AMEND]: {
        heading: 'Propose an Amendment',
        textLabel: 'Amendment Text',
        textPlaceholder: 'I move to amend by...',
        showOriginal: true
    },
    [MOTION_TYPES.POSTPONE_INDEFINITELY]: {
        heading: 'Postpone Indefinitely',
        textLabel: 'Reason (optional)',
        textPlaceholder: 'I move to postpone the question indefinitely',
        defaultText: 'to postpone the question indefinitely'
    },
    [MOTION_TYPES.COMMIT]: {
        heading: 'Refer to Committee',
        noTextInput: true,
        fixedText: 'to refer the pending question to a committee',
        extraFields: ['committeeName', 'instructions']
    },
    [MOTION_TYPES.POSTPONE_DEFINITELY]: {
        heading: 'Postpone to a Definite Time',
        noTextInput: true,
        fixedText: 'to postpone the pending question to a definite time',
        extraFields: ['postponeTime']
    },
    [MOTION_TYPES.LIMIT_DEBATE]: {
        heading: 'Limit or Extend Debate',
        noTextInput: true,
        fixedText: 'to limit or extend the limits of debate',
        extraFields: ['timeLimit', 'speechLimit']
    },
    [MOTION_TYPES.PREVIOUS_QUESTION]: {
        heading: 'Previous Question (Close Debate)',
        textLabel: null,
        defaultText: 'to close debate and immediately vote on the pending question',
        noTextInput: true
    },
    [MOTION_TYPES.LAY_ON_TABLE]: {
        heading: 'Lay on the Table',
        textLabel: null,
        defaultText: 'to lay the pending question on the table',
        noTextInput: true
    }
};

export default function SubsidiaryMotionModal({ motionType, currentMotionText, onSubmit, onClose }) {
    const config = SUBSIDIARY_FIELDS[motionType];
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-subsidiary" onClick={(e) => e.stopPropagation()}>
                <h3>{config.heading}</h3>
                <p className="modal-description">Subsidiary motion &mdash; applies to the pending question.</p>

                <RuleHintBox rules={rules} />

                {config.showOriginal && currentMotionText && (
                    <div className="info-box">
                        <strong>Pending Question:</strong><br />
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
                                <label>Committee Name</label>
                                <input
                                    type="text"
                                    value={committeeName}
                                    onChange={(e) => setCommitteeName(e.target.value)}
                                    placeholder="e.g., Finance Committee"
                                />
                            </div>
                            <div className="form-group">
                                <label>Instructions (optional)</label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="with instructions to..."
                                />
                            </div>
                        </>
                    )}

                    {motionType === MOTION_TYPES.POSTPONE_DEFINITELY && (
                        <div className="form-group">
                            <label>Postpone Until</label>
                            <input
                                type="text"
                                value={postponeTime}
                                onChange={(e) => setPostponeTime(e.target.value)}
                                placeholder="e.g., next meeting, 3:00 PM"
                            />
                        </div>
                    )}

                    {motionType === MOTION_TYPES.LIMIT_DEBATE && (
                        <>
                            <div className="form-group">
                                <label>Time Limit per Speaker (minutes)</label>
                                <input
                                    type="number"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(e.target.value)}
                                    placeholder="e.g., 3"
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Max Speeches per Member</label>
                                <input
                                    type="number"
                                    value={speechLimit}
                                    onChange={(e) => setSpeechLimit(e.target.value)}
                                    placeholder="e.g., 1"
                                    min="1"
                                />
                            </div>
                        </>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">Make Motion</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

