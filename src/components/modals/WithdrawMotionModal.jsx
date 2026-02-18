import React from 'react';

export default function WithdrawMotionModal({ motionText, mover, currentUser, onSubmit, onClose }) {
    const isMover = currentUser === mover;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>Withdraw a Motion</h3>
                <div className="info-box">
                    {isMover ? (
                        <p>You are the mover of this motion. If there is no objection, the motion
                            will be withdrawn by unanimous consent. If objected to, a majority vote
                            is required.</p>
                    ) : (
                        <p>Only the mover may request to withdraw. This will ask the chair to
                            request unanimous consent to withdraw the motion.</p>
                    )}
                </div>
                {motionText && (
                    <div className="modal-inline-note">
                        <strong>Motion:</strong> {motionText}
                        <div className="modal-choice-meta">Moved by: {mover}</div>
                    </div>
                )}
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={() => onSubmit()}>Request Withdrawal</button>
                </div>
            </div>
        </div>
    );
}

