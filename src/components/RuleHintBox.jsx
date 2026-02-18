import React from 'react';

export default function RuleHintBox({ rules, inOrder = true, reason }) {
    if (!rules) return null;

    const voteLabel = (() => {
        switch (rules.voteRequired) {
            case 'two_thirds': return '2/3 Vote';
            case 'none': return 'No Vote';
            case 'tie_sustains': return 'Tie Sustains Chair';
            default: return 'Majority Vote';
        }
    })();

    return (
        <div className="rule-hint-box">
            <div className={`rule-hint-status ${inOrder ? 'in-order' : 'out-of-order'}`}>
                {inOrder ? '\u2705' : '\u26A0\uFE0F'} {inOrder ? 'In Order' : 'Out of Order'}
                {reason && <span style={{ fontWeight: 400, marginLeft: '0.25rem' }}>&mdash; {reason}</span>}
            </div>
            <div className="rule-hint-props">
                <span className={`modal-pill ${rules.requiresSecond ? 'warn' : 'ok'}`}>
                    {rules.requiresSecond ? 'Second Required' : 'No Second'}
                </span>
                <span className={`modal-pill ${rules.isDebatable ? 'ok' : 'default'}`}>
                    {rules.isDebatable ? 'Debatable' : 'Not Debatable'}
                </span>
                <span className={`modal-pill ${rules.isAmendable ? 'ok' : 'default'}`}>
                    {rules.isAmendable ? 'Amendable' : 'Not Amendable'}
                </span>
                <span className="modal-pill default">{voteLabel}</span>
                {rules.canInterrupt && (
                    <span className="modal-pill warn">May Interrupt</span>
                )}
            </div>
        </div>
    );
}
