import React, { useState } from 'react';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';
import RuleHintBox from '../RuleHintBox';

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
                return (decidedMotions || []).filter((d) => d.result === 'adopted').map((d, i) => ({
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
            <div className="modal variant-bring_back" onClick={(e) => e.stopPropagation()}>
                <h3>{getHeading()}</h3>
                <p className="modal-description">Bring-back motion &mdash; returns a previously decided or tabled question.</p>

                <RuleHintBox rules={rules} />

                {items.length === 0 ? (
                    <div className="info-box">No items available for this action.</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select a motion:</label>
                            <div className="modal-choice-list">
                                {items.map((item) => (
                                    <label key={item.index} className={`modal-choice-item ${selectedIndex === item.index ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="bringBackItem"
                                            checked={selectedIndex === item.index}
                                            onChange={() => setSelectedIndex(item.index)}
                                            className="bringback-radio"
                                        />
                                        <div>
                                            <div>{item.label}</div>
                                            <div className="modal-choice-meta">{item.detail}</div>
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

