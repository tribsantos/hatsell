import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QuorumSettingSection({ onSetQuorum, currentRule }) {
    const { t } = useTranslation('meeting');
    const [ruleType, setRuleType] = useState(currentRule?.type || 'number');
    const [numberValue, setNumberValue] = useState(currentRule?.type === 'number' ? currentRule.value : 3);
    const [fractionValue, setFractionValue] = useState(currentRule?.type === 'fraction' ? currentRule.value : 'majority');

    const handleSubmit = () => {
        if (ruleType === 'number') {
            onSetQuorum({ type: 'number', value: parseInt(numberValue, 10) || 1 });
        } else {
            onSetQuorum({ type: 'fraction', value: fractionValue });
        }
    };

    return (
        <div className="panel" style={{ marginBottom: '1rem' }} aria-label="Quorum settings">
            <h3>{t('quorum_set_title')}</h3>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        name="quorumType"
                        value="number"
                        checked={ruleType === 'number'}
                        onChange={() => setRuleType('number')}
                    />
                    {t('quorum_specific_number')}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        name="quorumType"
                        value="fraction"
                        checked={ruleType === 'fraction'}
                        onChange={() => setRuleType('fraction')}
                    />
                    {t('quorum_fraction_label')}
                </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {ruleType === 'number' ? (
                    <input
                        type="number"
                        min="1"
                        value={numberValue}
                        onChange={(e) => setNumberValue(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'var(--h-bg-warm, #f9f8f5)',
                            border: '2px solid var(--h-border-soft, #ddd)',
                            borderRadius: '3px',
                            fontSize: '0.9rem',
                            color: 'var(--h-fg, #1a1a1a)'
                        }}
                    />
                ) : (
                    <select
                        value={fractionValue}
                        onChange={(e) => setFractionValue(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'var(--h-bg-warm, #f9f8f5)',
                            border: '2px solid var(--h-border-soft, #ddd)',
                            borderRadius: '3px',
                            fontSize: '0.9rem',
                            color: 'var(--h-fg, #1a1a1a)'
                        }}
                    >
                        <option value="majority">{t('quorum_majority')}</option>
                        <option value="1/3">{t('quorum_one_third')}</option>
                        <option value="2/3">{t('quorum_two_thirds')}</option>
                    </select>
                )}
                <button
                    onClick={handleSubmit}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    data-tooltip={t('quorum_set_tooltip')} title={t('quorum_set_tooltip')}
                >
                    {t('quorum_set_button')}
                </button>
            </div>
        </div>
    );
}
