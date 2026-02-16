import React, { useState } from 'react';

export default function QuorumSettingSection({ onSetQuorum, currentRule }) {
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
        <div style={{
            background: 'rgba(230, 126, 34, 0.08)',
            border: '2px solid #ddd',
            borderLeft: '4px solid #e67e22',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
        }}>
            <div style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#7b2d3b',
                marginBottom: '0.75rem'
            }}>
                Set Minimum Quorum
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        name="quorumType"
                        value="number"
                        checked={ruleType === 'number'}
                        onChange={() => setRuleType('number')}
                    />
                    Specific Number
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        name="quorumType"
                        value="fraction"
                        checked={ruleType === 'fraction'}
                        onChange={() => setRuleType('fraction')}
                    />
                    Fraction of Members
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
                            background: '#f9f8f5',
                            border: '2px solid #ddd',
                            borderRadius: '3px',
                            fontSize: '0.9rem',
                            color: '#1a1a1a'
                        }}
                    />
                ) : (
                    <select
                        value={fractionValue}
                        onChange={(e) => setFractionValue(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: '#f9f8f5',
                            border: '2px solid #ddd',
                            borderRadius: '3px',
                            fontSize: '0.9rem',
                            color: '#1a1a1a'
                        }}
                    >
                        <option value="majority">Majority (more than half)</option>
                        <option value="1/3">One-third</option>
                        <option value="2/3">Two-thirds</option>
                    </select>
                )}
                <button
                    onClick={handleSubmit}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    data-tooltip="Set the minimum attendance required to conduct business" title="Set the minimum attendance required to conduct business"
                >
                    Set Quorum
                </button>
            </div>
        </div>
    );
}
