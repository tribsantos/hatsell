import React, { useState } from 'react';

export default function RequestForInfoModal({ onSubmit, onClose }) {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!question.trim()) return;
        onSubmit(question);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Request for Information</h3>
                <div className="info-box">
                    A Request for Information (Point of Information) asks a factual question
                    about the business at hand. The chair or a designated member will respond.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>State Your Question</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="I rise for a point of information: ..."
                            autoFocus
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">Submit Question</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

