import React from 'react';

export default function DecidedMotionsList({ decidedMotions }) {
    if (!decidedMotions || decidedMotions.length === 0) return null;

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#666', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Decided Motions ({decidedMotions.length})
            </h4>
            {decidedMotions.map((item, idx) => (
                <div key={idx} style={{
                    padding: '0.75rem',
                    background: '#f9f8f5',
                    borderLeft: `3px solid ${item.result === 'adopted' ? '#27ae60' : '#c0392b'}`,
                    borderRadius: '3px',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ color: '#1a1a1a' }}>{item.text}</div>
                        <span style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '3px',
                            background: item.result === 'adopted' ? 'rgba(39, 174, 96, 0.12)' : 'rgba(192, 57, 43, 0.12)',
                            color: item.result === 'adopted' ? '#1e8449' : '#c0392b',
                            whiteSpace: 'nowrap',
                            marginLeft: '0.5rem',
                            fontWeight: 700
                        }}>
                            {item.result === 'adopted' ? 'Adopted' : 'Defeated'}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                        {item.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
