import React from 'react';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

export default function AppealModal({ chairRuling, onSubmit, onClose }) {
    const rules = getRules(MOTION_TYPES.APPEAL);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-appeal" onClick={(e) => e.stopPropagation()}>
                <h3>Appeal the Decision of the Chair</h3>
                <p className="modal-description">
                    An appeal reverses the chair's ruling by a vote of the assembly.
                    Each member may speak once; the chair may speak twice. A tie vote sustains the chair.
                </p>

                <RuleHintBox rules={rules} />

                {chairRuling && (
                    <div className="warning-box">
                        <strong>Chair's Ruling:</strong>
                        <p className="sidebar-list-meta" style={{ marginTop: '0.25rem' }}>{chairRuling}</p>
                    </div>
                )}

                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={() => onSubmit()}>Appeal</button>
                </div>
            </div>
        </div>
    );
}

