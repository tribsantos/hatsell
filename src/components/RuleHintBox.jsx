import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RuleHintBox({ rules, inOrder = true, reason }) {
    const { t } = useTranslation('meeting');
    if (!rules) return null;

    const voteLabel = (() => {
        switch (rules.voteRequired) {
            case 'two_thirds': return t('rule_two_thirds_vote');
            case 'none': return t('rule_no_vote');
            case 'tie_sustains': return t('rule_tie_sustains');
            default: return t('rule_majority_vote');
        }
    })();

    return (
        <div className="rule-hint-box">
            <div className={`rule-hint-status ${inOrder ? 'in-order' : 'out-of-order'}`}>
                {inOrder ? '\u2705' : '\u26A0\uFE0F'} {inOrder ? t('rule_in_order') : t('rule_out_of_order')}
                {reason && <span style={{ fontWeight: 400, marginLeft: '0.25rem' }}>&mdash; {reason}</span>}
            </div>
            <div className="rule-hint-props">
                <span className={`modal-pill ${rules.requiresSecond ? 'warn' : 'ok'}`}>
                    {rules.requiresSecond ? t('rule_second_required') : t('rule_no_second')}
                </span>
                <span className={`modal-pill ${rules.isDebatable ? 'ok' : 'default'}`}>
                    {rules.isDebatable ? t('rule_debatable') : t('rule_not_debatable')}
                </span>
                <span className={`modal-pill ${rules.isAmendable ? 'ok' : 'default'}`}>
                    {rules.isAmendable ? t('rule_amendable') : t('rule_not_amendable')}
                </span>
                <span className="modal-pill default">{voteLabel}</span>
                {rules.canInterrupt && (
                    <span className="modal-pill warn">{t('rule_may_interrupt')}</span>
                )}
            </div>
        </div>
    );
}
