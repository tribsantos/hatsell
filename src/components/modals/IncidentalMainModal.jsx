import React from 'react';
import { incidentalMainOptions } from '../../constants';

export default function IncidentalMainModal({ onSelectTemplate, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Incidental Main Motions</h3>
                <p className="modal-intro">
                    Choose an incidental main motion template. You can edit the text before introducing it.
                </p>
                <div className="modal-template-list">
                    {incidentalMainOptions.map((opt) => (
                        <button
                            key={opt.label}
                            className="secondary modal-template-button"
                            onClick={() => onSelectTemplate(opt.template, opt.heading)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button type="button" className="secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

