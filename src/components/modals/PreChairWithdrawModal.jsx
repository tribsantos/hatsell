import React, { useState } from 'react';

export default function PreChairWithdrawModal({ motionText, onWithdraw, onReformulate, onClose }) {
    const [newText, setNewText] = useState(motionText || '');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>Withdraw or Reformulate</h3>

                <div className="info-box">
                    <p>The chair has not recognized your motion yet. You may unilaterally
                        withdraw or reformulate it.</p>
                </div>

                <div className="modal-inline-note">
                    <strong>Your motion:</strong> {motionText}
                </div>

                <div className="form-group">
                    <label>New text (for reformulation)</label>
                    <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Enter revised motion text..."
                        className="prechair-textarea"
                    />
                </div>

                <div className="modal-buttons">
                    <button type="button" onClick={onWithdraw} className="danger">Withdraw</button>
                    <button
                        type="button"
                        onClick={() => {
                            if (newText.trim() && newText.trim() !== motionText) {
                                onReformulate(newText.trim());
                            }
                        }}
                        disabled={!newText.trim() || newText.trim() === motionText}
                    >
                        Reformulate
                    </button>
                    <button type="button" onClick={onClose} className="secondary">Go Back</button>
                </div>
            </div>
        </div>
    );
}

