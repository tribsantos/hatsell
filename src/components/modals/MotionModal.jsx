import React, { useState, useEffect } from 'react';
import { specialOriginalOptions } from '../../constants';

export default function MotionModal({ heading = 'Introduce a Motion', initialText = '', showSpecialOptions = true, onSubmit, onClose }) {
    const [motionText, setMotionText] = useState(initialText || '');

    useEffect(() => {
        setMotionText(initialText || '');
    }, [initialText]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!motionText.trim()) return;
        onSubmit(motionText);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{heading || 'Introduce a Motion'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Motion Text</label>
                        <textarea
                            value={motionText}
                            onChange={(e) => setMotionText(e.target.value)}
                            placeholder="I move that..."
                            autoFocus
                        />
                    </div>

                    {showSpecialOptions && (
                        <>
                            <div style={{ textAlign: 'center', marginTop: '0.25rem', marginBottom: '0.75rem', color: '#666', fontSize: '0.95rem' }}>
                                Special types of original main motions
                            </div>
                            <div style={{display: 'grid', gap: '0.75rem', marginBottom: '1rem'}}>
                                {specialOriginalOptions.map((opt) => (
                                    <button
                                        key={opt.label}
                                        type="button"
                                        className="secondary"
                                        onClick={() => setMotionText(opt.template)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            Introduce Motion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
