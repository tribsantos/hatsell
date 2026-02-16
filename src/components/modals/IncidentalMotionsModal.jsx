import React from 'react';
import { incidentalOptions } from '../../constants';

const INCIDENTAL_INTERRUPTS = {
    'Point of Order': true,
    'Appeal the Decision of the Chair': true,
    'Parliamentary Inquiry': true,
    'Request for Information': true,
    'Division of the Assembly': true,
    'Suspend the Rules': false
};

export default function IncidentalMotionsModal({ onSubmit, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Incidental Motions</h3>
                <p style={{color: '#666', marginBottom: '1rem'}}>
                    Choose an incidental motion to bring before the chair.
                </p>
                <div style={{display: 'grid', gap: '0.75rem'}}>
                    {incidentalOptions.map((opt) => {
                        const interrupts = INCIDENTAL_INTERRUPTS[opt];
                        return (
                            <button key={opt} className="secondary" onClick={() => onSubmit(opt)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {opt}
                                {interrupts !== undefined && (
                                    <span style={{
                                        fontSize: '0.65rem',
                                        padding: '0.15rem 0.4rem',
                                        background: interrupts ? 'rgba(230, 126, 34, 0.15)' : 'rgba(39, 174, 96, 0.08)',
                                        borderRadius: '3px',
                                        color: interrupts ? '#e67e22' : '#27ae60',
                                        fontWeight: '600',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {interrupts ? 'Interrupts' : 'Does not interrupt'}
                                    </span>
                                )}
                            </button>
                        );
                    })}
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
