import React from 'react';

export default function AppealModal({ chairRuling, onSubmit, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Appeal the Decision of the Chair</h3>
                <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                    <p>An appeal reverses the chair's ruling by a vote of the assembly.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                        Requires a second. Debatable (each member may speak once; chair may speak twice).
                        A tie vote sustains the chair's decision.
                    </p>
                </div>
                {chairRuling && (
                    <div style={{
                        padding: '0.75rem', marginBottom: '1.5rem',
                        background: 'rgba(230, 126, 34, 0.08)',
                        borderLeft: '3px solid #e67e22', borderRadius: '4px'
                    }}>
                        <strong style={{ color: '#e67e22' }}>Chair's Ruling:</strong>
                        <p style={{ marginTop: '0.25rem' }}>{chairRuling}</p>
                    </div>
                )}
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                    <button onClick={() => onSubmit()}>Appeal</button>
                </div>
            </div>
        </div>
    );
}
