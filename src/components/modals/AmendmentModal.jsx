import React, { useState, useMemo } from 'react';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import { computeWordDiff, generateAmendmentLanguage, isPunctuation } from '../../engine/amendmentDiff';
import RuleHintBox from '../RuleHintBox';

function DiffDisplay({ ops }) {
    return (
        <div className="amendment-diff">
            <div className="amendment-diff-label">Changes</div>
            <div>
                {ops.map((op, i) => {
                    const needsSpace = i > 0 && !isPunctuation(op.word);
                    return (
                        <React.Fragment key={i}>
                            {needsSpace && ' '}
                            <span className={op.type === 'delete' ? 'diff-word-delete' : op.type === 'insert' ? 'diff-word-insert' : undefined}>
                                {op.word}
                            </span>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

function AmendmentLanguageBox({ language }) {
    return (
        <div className="amendment-language-box">
            <div className="amendment-language-label">Formal Amendment</div>
            <div>{language}</div>
        </div>
    );
}

export default function AmendmentModal({ originalMotion, onSubmit, onClose }) {
    const [proposedText, setProposedText] = useState(originalMotion || '');
    const rules = getRules(MOTION_TYPES.AMEND);

    const ops = useMemo(() => computeWordDiff(originalMotion || '', proposedText), [originalMotion, proposedText]);
    const language = useMemo(() => generateAmendmentLanguage(originalMotion || '', proposedText), [originalMotion, proposedText]);

    const hasChanges = language !== null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasChanges) return;
        onSubmit({ language, proposedText });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-amend" onClick={(e) => e.stopPropagation()}>
                <h3>Amend the Motion</h3>
                <p className="modal-description">Subsidiary motion &mdash; proposes a change to the pending question.</p>

                <RuleHintBox rules={rules} />

                <div className="info-box">
                    <strong>Original Motion:</strong><br />
                    {originalMotion}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Proposed Amended Text</label>
                        <textarea
                            value={proposedText}
                            onChange={(e) => setProposedText(e.target.value)}
                            placeholder="Edit the text above to reflect your proposed changes..."
                            autoFocus
                        />
                    </div>

                    {hasChanges && <DiffDisplay ops={ops} />}
                    {hasChanges && <AmendmentLanguageBox language={language} />}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" disabled={!hasChanges}>
                            Propose Amendment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
