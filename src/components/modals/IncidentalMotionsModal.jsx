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
            <div className="modal variant-incidental" onClick={(e) => e.stopPropagation()}>
                <h3>Incidental Motions</h3>
                <p className="modal-intro">Choose an incidental motion to bring before the chair.</p>
                <div className="modal-template-list">
                    {incidentalOptions.map((opt) => {
                        const interrupts = INCIDENTAL_INTERRUPTS[opt];
                        return (
                            <button
                                key={opt}
                                className="secondary modal-template-button"
                                onClick={() => onSubmit(opt)}
                            >
                                <span>{opt}</span>
                                {interrupts !== undefined && (
                                    <span className={`modal-pill ${interrupts ? 'warn' : 'ok'}`}>
                                        {interrupts ? 'Interrupts' : 'Does not interrupt'}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

