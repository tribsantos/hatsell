import React, { useState } from 'react';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';

export default function BringBackModal({ motionType, tabledMotions, decidedMotions, onSubmit, onClose }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const rules = getRules(motionType);

    if (!rules) return null;

    const getHeading = () => {
        switch (motionType) {
            case MOTION_TYPES.TAKE_FROM_TABLE: return 'Take from the Table';
            case MOTION_TYPES.RECONSIDER: return 'Reconsider';
            case MOTION_TYPES.RESCIND: return 'Rescind/Amend Previously Adopted';
            default: return 'Bring Back Motion';
        }
    };

    const getItems = () => {
        switch (motionType) {
            case MOTION_TYPES.TAKE_FROM_TABLE:
                return (tabledMotions || []).map((t, i) => ({
                    index: i,
                    label: t.mainMotionText || 'Tabled motion',
                    detail: `Tabled at ${new Date(t.tabledAt).toLocaleTimeString()}`
                }));
            case MOTION_TYPES.RECONSIDER:
                return (decidedMotions || []).map((d, i) => ({
                    index: i,
                    label: d.text || 'Decided motion',
                    detail: `${d.result === 'adopted' ? 'Adopted' : 'Defeated'} - ${d.description || ''}`
                }));
            case MOTION_TYPES.RESCIND:
                return (decidedMotions || []).filter(d => d.result === 'adopted').map((d, i) => ({
                    index: i,
                    label: d.text || 'Adopted motion',
                    detail: d.description || ''
                }));
            default:
                return [];
        }
    };

    const items = getItems();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (items.length === 0) return;
        const text = motionType === MOTION_TYPES.TAKE_FROM_TABLE
            ? `to take from the table: "${items[selectedIndex]?.label}"`
            : motionType === MOTION_TYPES.RECONSIDER
                ? `to reconsider the vote on: "${items[selectedIndex]?.label}"`
                : `to rescind: "${items[selectedIndex]?.label}"`;
        onSubmit(motionType, text, { selectedIndex });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{getHeading()}</h3>

                <div style={{
                    display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap'
                }}>
                    <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.5rem',
                        background: 'rgba(192, 57, 43, 0.08)', borderRadius: '3px', color: '#c0392b'
                    }}>
                        {rules.isDebatable ? 'Debatable' : 'Not Debatable'}
                    </span>
                    <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.5rem',
                        background: 'rgba(192, 57, 43, 0.08)', borderRadius: '3px', color: '#c0392b'
                    }}>
                        {rules.voteRequired === 'two_thirds' ? '2/3 Vote Required' : 'Majority Vote'}
                    </span>
                    <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.5rem',
                        background: rules.canInterrupt ? 'rgba(230, 126, 34, 0.15)' : 'rgba(39, 174, 96, 0.08)',
                        borderRadius: '3px',
                        color: rules.canInterrupt ? '#e67e22' : '#27ae60'
                    }}>
                        {rules.canInterrupt ? 'Interrupts speaker' : 'Does not interrupt'}
                    </span>
                </div>

                {items.length === 0 ? (
                    <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                        No items available for this action.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select a motion:</label>
                            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {items.map((item) => (
                                    <label key={item.index} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                                        padding: '0.75rem',
                                        background: selectedIndex === item.index
                                            ? 'rgba(192, 57, 43, 0.08)'
                                            : '#f9f8f5',
                                        borderRadius: '4px',
                                        border: selectedIndex === item.index
                                            ? '1px solid rgba(192, 57, 43, 0.3)'
                                            : '1px solid transparent',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="radio"
                                            name="bringBackItem"
                                            checked={selectedIndex === item.index}
                                            onChange={() => setSelectedIndex(item.index)}
                                            style={{ marginTop: '0.2rem' }}
                                        />
                                        <div>
                                            <div style={{ color: '#1a1a1a' }}>{item.label}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                                                {item.detail}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="modal-buttons">
                            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                            <button type="submit">Make Motion</button>
                        </div>
                    </form>
                )}

                {items.length === 0 && (
                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}
