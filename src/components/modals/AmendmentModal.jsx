import React, { useState } from 'react';

export default function AmendmentModal({ originalMotion, onSubmit, onClose }) {
    const [amendmentText, setAmendmentText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amendmentText.trim()) return;
        onSubmit(amendmentText);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Amend the Motion</h3>
                <div className="info-box">
                    <strong>Original Motion:</strong><br />
                    {originalMotion}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Amendment Text</label>
                        <textarea
                            value={amendmentText}
                            onChange={(e) => setAmendmentText(e.target.value)}
                            placeholder="I move to amend by..."
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            Propose Amendment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

