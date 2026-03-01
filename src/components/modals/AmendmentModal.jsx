import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import { computeWordDiff, generateAmendmentLanguage, isPunctuation } from '../../engine/amendmentDiff';
import RuleHintBox from '../RuleHintBox';

function DiffDisplay({ ops, changesLabel }) {
    return (
        <div className="amendment-diff">
            <div className="amendment-diff-label">{changesLabel}</div>
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

function AmendmentLanguageBox({ language, formalLabel }) {
    return (
        <div className="amendment-language-box">
            <div className="amendment-language-label">{formalLabel}</div>
            <div>{language}</div>
        </div>
    );
}

export default function AmendmentModal({ originalMotion, onSubmit, onClose }) {
    const { t } = useTranslation('modals');
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
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) e.stopPropagation(); }}>
            <div className="modal variant-amend" role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
                <h3>{t('amendment_heading')}</h3>
                <p className="modal-description">{t('amendment_desc')}</p>

                <RuleHintBox rules={rules} />

                <div className="info-box">
                    <strong>{t('amendment_original')}</strong><br />
                    {originalMotion}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('amendment_proposed')}</label>
                        <textarea
                            value={proposedText}
                            onChange={(e) => setProposedText(e.target.value)}
                            placeholder={t('amendment_placeholder')}
                            autoFocus
                        />
                    </div>

                    {hasChanges && <DiffDisplay ops={ops} changesLabel={t('amendment_changes')} />}
                    {hasChanges && <AmendmentLanguageBox language={language} formalLabel={t('amendment_formal')} />}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>
                            {t('amendment_cancel')}
                        </button>
                        <button type="submit" disabled={!hasChanges}>
                            {t('amendment_submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
