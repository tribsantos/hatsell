import React, { useState } from 'react';

export default function PreChairWithdrawModal({ motionText, onWithdraw, onReformulate, onClose }) {
    const [newText, setNewText] = useState(motionText || '');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Withdraw or Reformulate</h3>

                <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                    <p>The chair has not recognized your motion yet. You may unilaterally
                        withdraw or reformulate it.</p>
                </div>

                <div style={{
                    padding: '0.75rem', marginBottom: '1.5rem',
                    background: '#f9f8f5', borderRadius: '4px',
                    borderLeft: '3px solid #c0392b'
                }}>
                    <strong>Your motion:</strong> {motionText}
                </div>

                <div className="form-group">
                    <label>New text (for reformulation)</label>
                    <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Enter revised motion text..."
                        style={{ minHeight: '80px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={onWithdraw}
                        className="danger"
                        style={{ flex: 1 }}
                    >
                        Withdraw
                    </button>
                    <button
                        onClick={() => {
                            if (newText.trim() && newText.trim() !== motionText) {
                                onReformulate(newText.trim());
                            }
                        }}
                        disabled={!newText.trim() || newText.trim() === motionText}
                        style={{ flex: 1 }}
                    >
                        Reformulate
                    </button>
                    <button
                        onClick={onClose}
                        className="secondary"
                        style={{ flex: 1 }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
