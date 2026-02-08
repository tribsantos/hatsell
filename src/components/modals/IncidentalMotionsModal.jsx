import React from 'react';
import { incidentalOptions } from '../../constants';

export default function IncidentalMotionsModal({ onSubmit, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Incidental Motions</h3>
                <p style={{color: '#666', marginBottom: '1rem'}}>
                    Choose an incidental motion to bring before the chair.
                </p>
                <div style={{display: 'grid', gap: '0.75rem'}}>
                    {incidentalOptions.map((opt) => (
                        <button key={opt} className="secondary" onClick={() => onSubmit(opt)}>
                            {opt}
                        </button>
                    ))}
                </div>
                <div className="modal-buttons" style={{marginTop: '1.25rem'}}>
                    <button type="button" className="secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
