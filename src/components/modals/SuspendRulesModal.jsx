import React, { useState } from 'react';

const TEMPLATES = [
    'Allow a non-member to address the assembly',
    'Take up business out of scheduled order',
    'Extend time for current speaker',
    'Consider a matter without referral to committee'
];

export default function SuspendRulesModal({ onSubmit, onClose }) {
    const [customPurpose, setCustomPurpose] = useState('');

    const handleTemplate = (purpose) => {
        onSubmit(purpose);
    };

    const handleCustom = (e) => {
        e.preventDefault();
        if (!customPurpose.trim()) return;
        onSubmit(customPurpose.trim());
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Suspend the Rules</h3>
                <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                    <p>Suspend the Rules allows the assembly to do something that would
                        otherwise be out of order under the standing rules.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                        Requires a second. Not debatable. Two-thirds vote required.
                    </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block', marginBottom: '0.75rem', fontWeight: 600,
                        fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.03em', color: '#333'
                    }}>
                        Common Purposes
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {TEMPLATES.map((t, i) => (
                            <button
                                key={i}
                                type="button"
                                className="secondary"
                                style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                                onClick={() => handleTemplate(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleCustom}>
                    <div className="form-group">
                        <label>Custom Purpose</label>
                        <textarea
                            value={customPurpose}
                            onChange={(e) => setCustomPurpose(e.target.value)}
                            placeholder="I move to suspend the rules in order to..."
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={!customPurpose.trim()}>Move to Suspend</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
