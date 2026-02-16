import React, { useState } from 'react';
import { MOTION_TYPES } from '../../constants/motionTypes';
import { getRules } from '../../engine/motionRules';

export default function PrivilegedMotionModal({ motionType, onSubmit, onClose }) {
    const [recessDuration, setRecessDuration] = useState('');
    const [fixedTime, setFixedTime] = useState('');
    const [privilegeText, setPrivilegeText] = useState('');
    const rules = getRules(motionType);

    if (!rules) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        let text = '';
        const metadata = {};

        switch (motionType) {
            case MOTION_TYPES.ADJOURN:
                text = 'to adjourn';
                break;
            case MOTION_TYPES.RECESS:
                text = `to recess for ${recessDuration || '10'} minutes`;
                metadata.recessDuration = parseInt(recessDuration, 10) || 10;
                break;
            case MOTION_TYPES.FIX_TIME_TO_ADJOURN:
                text = `to fix the time of the next meeting at ${fixedTime || 'a time to be determined'}`;
                metadata.fixedTime = fixedTime;
                break;
            case MOTION_TYPES.QUESTION_OF_PRIVILEGE:
                text = privilegeText || 'question of privilege';
                break;
            case MOTION_TYPES.ORDERS_OF_DAY:
                text = 'to call for the orders of the day';
                break;
            default:
                return;
        }

        onSubmit(motionType, text, metadata);
    };

    const getHeading = () => {
        switch (motionType) {
            case MOTION_TYPES.ADJOURN: return 'Move to Adjourn';
            case MOTION_TYPES.RECESS: return 'Move to Recess';
            case MOTION_TYPES.FIX_TIME_TO_ADJOURN: return 'Fix Time to Adjourn';
            case MOTION_TYPES.QUESTION_OF_PRIVILEGE: return 'Question of Privilege';
            case MOTION_TYPES.ORDERS_OF_DAY: return 'Call for Orders of the Day';
            default: return 'Privileged Motion';
        }
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
                        Not Debatable
                    </span>
                    <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.5rem',
                        background: 'rgba(192, 57, 43, 0.08)', borderRadius: '3px', color: '#c0392b'
                    }}>
                        {rules.requiresSecond ? 'Requires Second' : 'No Second Needed'}
                    </span>
                    {rules.voteRequired !== 'none' && (
                        <span style={{
                            fontSize: '0.75rem', padding: '0.2rem 0.5rem',
                            background: 'rgba(192, 57, 43, 0.08)', borderRadius: '3px', color: '#c0392b'
                        }}>
                            Majority Vote
                        </span>
                    )}
                    <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.5rem',
                        background: rules.canInterrupt ? 'rgba(230, 126, 34, 0.15)' : 'rgba(39, 174, 96, 0.08)',
                        borderRadius: '3px',
                        color: rules.canInterrupt ? '#e67e22' : '#27ae60'
                    }}>
                        {rules.canInterrupt ? 'Interrupts speaker' : 'Does not interrupt'}
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    {motionType === MOTION_TYPES.RECESS && (
                        <div className="form-group">
                            <label>Recess Duration (minutes)</label>
                            <input
                                type="number"
                                value={recessDuration}
                                onChange={(e) => setRecessDuration(e.target.value)}
                                placeholder="10"
                                min="1"
                                autoFocus
                                style={{
                                    width: '100%', padding: '0.5rem',
                                    background: '#f9f8f5', border: '2px solid #ddd',
                                    borderRadius: '3px', color: '#1a1a1a'
                                }}
                            />
                        </div>
                    )}

                    {motionType === MOTION_TYPES.FIX_TIME_TO_ADJOURN && (
                        <div className="form-group">
                            <label>Date/Time for Next Meeting</label>
                            <input
                                type="text"
                                value={fixedTime}
                                onChange={(e) => setFixedTime(e.target.value)}
                                placeholder="e.g., Thursday at 7:00 PM"
                                autoFocus
                                style={{
                                    width: '100%', padding: '0.5rem',
                                    background: '#f9f8f5', border: '2px solid #ddd',
                                    borderRadius: '3px', color: '#1a1a1a'
                                }}
                            />
                        </div>
                    )}

                    {motionType === MOTION_TYPES.QUESTION_OF_PRIVILEGE && (
                        <div className="form-group">
                            <label>State the Matter of Privilege</label>
                            <textarea
                                value={privilegeText}
                                onChange={(e) => setPrivilegeText(e.target.value)}
                                placeholder="I rise to a question of privilege affecting..."
                                autoFocus
                            />
                        </div>
                    )}

                    {(motionType === MOTION_TYPES.ADJOURN || motionType === MOTION_TYPES.ORDERS_OF_DAY) && (
                        <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                            {motionType === MOTION_TYPES.ADJOURN
                                ? 'This motion, if adopted, will immediately adjourn the meeting.'
                                : 'This demand requires the assembly to conform to the agenda.'}
                        </div>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">
                            {motionType === MOTION_TYPES.ORDERS_OF_DAY ? 'Demand' : 'Make Motion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
