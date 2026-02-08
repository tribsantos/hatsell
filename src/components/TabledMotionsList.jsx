import React from 'react';

export default function TabledMotionsList({ tabledMotions, isChair, onTakeFromTable }) {
    if (!tabledMotions || tabledMotions.length === 0) return null;

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#666', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Tabled Motions ({tabledMotions.length})
            </h4>
            {tabledMotions.map((item, idx) => (
                <div key={idx} style={{
                    padding: '0.75rem',
                    background: '#f9f8f5',
                    borderLeft: '3px solid #bbb',
                    borderRadius: '3px',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                }}>
                    <div style={{ color: '#1a1a1a' }}>{item.mainMotionText}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                        Tabled at {new Date(item.tabledAt).toLocaleTimeString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
