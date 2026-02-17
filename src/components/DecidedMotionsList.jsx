import React from 'react';

export default function DecidedMotionsList({ decidedMotions }) {
    if (!decidedMotions || decidedMotions.length === 0) return null;

    return (
        <div className="sidebar-list">
            <h4 className="sidebar-list-title">Decided Motions ({decidedMotions.length})</h4>
            {decidedMotions.map((item, idx) => (
                <div key={idx} className={`sidebar-list-item ${item.result === 'adopted' ? 'adopted' : 'defeated'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>{item.text}</div>
                        <span className={`motion-status-badge ${item.result === 'adopted' ? 'adopted' : 'defeated'}`}>
                            {item.result === 'adopted' ? 'Adopted' : 'Defeated'}
                        </span>
                    </div>
                    <div className="sidebar-list-meta">{item.description}</div>
                </div>
            ))}
        </div>
    );
}
