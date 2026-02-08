import React, { useState } from 'react';

export default function MinutesCorrectionModal({ onSubmit, onClose }) {
    const [correction, setCorrection] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!correction.trim()) return;
        onSubmit(correction);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Propose Correction to Minutes</h3>
                <div className="info-box" style={{marginBottom: '1.5rem'}}>
                    Describe the correction needed to the minutes from the previous meeting.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Proposed Correction</label>
                        <textarea
                            value={correction}
                            onChange={(e) => setCorrection(e.target.value)}
                            placeholder="On page X, line Y should read..."
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            Propose Correction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
