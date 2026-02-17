import React, { useState } from 'react';

export default function ParliamentaryInquiryModal({ onSubmit, onClose }) {
    const [inquiry, setInquiry] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inquiry.trim()) return;
        onSubmit(inquiry);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Parliamentary Inquiry</h3>
                <div className="info-box">
                    A Parliamentary Inquiry asks the chair a question about procedure or the
                    effect of a motion. The chair will respond to your inquiry.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>State Your Inquiry</label>
                        <textarea
                            value={inquiry}
                            onChange={(e) => setInquiry(e.target.value)}
                            placeholder="I rise to a parliamentary inquiry: Is it in order to..."
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">Submit Inquiry</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

