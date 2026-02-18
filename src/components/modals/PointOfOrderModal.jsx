import React, { useState } from 'react';

export default function PointOfOrderModal({ onSubmit, onClose }) {
    const [concern, setConcern] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!concern.trim()) return;
        onSubmit(concern);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>Point of Order</h3>
                <div className="info-box">
                    A Point of Order calls attention to a breach of rules or procedural error.
                    The chair will rule on your concern.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>State Your Concern</label>
                        <textarea
                            value={concern}
                            onChange={(e) => setConcern(e.target.value)}
                            placeholder="Point of order: ..."
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">Raise Point of Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

