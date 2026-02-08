import React from 'react';

export default function WithdrawMotionModal({ motionText, mover, currentUser, onSubmit, onClose }) {
    const isMover = currentUser === mover;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Withdraw a Motion</h3>
                <div className="info-box" style={{ marginBottom: '1.5rem' }}>
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
                    <div style={{
                        padding: '0.75rem', marginBottom: '1.5rem',
                        background: '#f9f8f5', borderRadius: '4px',
                        borderLeft: '3px solid #c0392b'
                    }}>
                        <strong>Motion:</strong> {motionText}
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                            Moved by: {mover}
                        </div>
                    </div>
                )}
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                    <button onClick={() => onSubmit()}>Request Withdrawal</button>
                </div>
            </div>
        </div>
    );
}
