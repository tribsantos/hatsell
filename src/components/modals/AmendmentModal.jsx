import React, { useState } from 'react';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

export default function AmendmentModal({ originalMotion, onSubmit, onClose }) {
    const [amendmentText, setAmendmentText] = useState('');
    const rules = getRules(MOTION_TYPES.AMEND);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amendmentText.trim()) return;
        onSubmit(amendmentText);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-amend" onClick={(e) => e.stopPropagation()}>
                <h3>Amend the Motion</h3>
                <p className="modal-description">Subsidiary motion &mdash; proposes a change to the pending question.</p>

                <RuleHintBox rules={rules} />

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

