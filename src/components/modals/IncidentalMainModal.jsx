import React from 'react';
import { incidentalMainOptions } from '../../constants';

export default function IncidentalMainModal({ onSelectTemplate, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Incidental Main Motions</h3>
                <p style={{color: '#666', marginBottom: '1rem'}}>
                    Choose an incidental main motion template. You can edit the text before introducing it.
                </p>
                <div style={{display: 'grid', gap: '0.75rem'}}>
                    {incidentalMainOptions.map((opt) => (
                        <button
                            key={opt.label}
                            className="secondary"
                            onClick={() => onSelectTemplate(opt.template, opt.heading)}
                        >
                            {opt.label}
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
