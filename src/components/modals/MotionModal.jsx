import React, { useState, useEffect } from 'react';
import { specialOriginalOptions } from '../../constants';

export default function MotionModal({ heading = 'Introduce a Motion', initialText = '', showSpecialOptions = true, previousNotice, onSubmit, onClose }) {
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
                            <p className="modal-intro" style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                                Special types of original main motions
                            </p>
                            <div className="modal-template-list">
                                {specialOriginalOptions.map((opt) => {
                                    const needsNotice = opt.requiresNotice && (!previousNotice || !previousNotice[opt.requiresNotice]);
                                    return (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            className="secondary modal-template-button"
                                            onClick={() => !needsNotice && setMotionText(opt.template)}
                                            disabled={needsNotice}
                                            style={needsNotice ? { opacity: 0.45 } : {}}
                                            data-tooltip={needsNotice ? 'Requires previous notice' : ''}
                                            title={needsNotice ? 'Requires previous notice' : ''}
                                        >
                                            <span>{opt.label}</span>
                                            {needsNotice && (
                                                <span className="modal-choice-meta" style={{ color: 'var(--h-red)', fontStyle: 'italic' }}>
                                                    (requires previous notice)
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">Introduce Motion</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

