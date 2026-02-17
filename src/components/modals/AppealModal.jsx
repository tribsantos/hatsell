import React from 'react';

export default function AppealModal({ chairRuling, onSubmit, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Appeal the Decision of the Chair</h3>

                <div className="info-box">
                    <p>An appeal reverses the chair's ruling by a vote of the assembly.</p>
                    <p className="modal-intro" style={{ marginBottom: '0' }}>
                        Requires a second. Debatable (each member may speak once; chair may speak twice).
                        A tie vote sustains the chair's decision.
                    </p>
                </div>

                {chairRuling && (
                    <div className="warning-box">
                        <strong>Chair's Ruling:</strong>
                        <p className="sidebar-list-meta" style={{ marginTop: '0.25rem' }}>{chairRuling}</p>
                    </div>
                )}

                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={() => onSubmit()}>Appeal</button>
                </div>
            </div>
        </div>
    );
}

