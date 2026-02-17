import React from 'react';
import { ROLES } from '../constants';

export default function RollCallSection({ participants, rollCallStatus, currentUser, isChair, onCallMember, onRespondToRollCall, onMarkPresent }) {
    const myStatus = rollCallStatus[currentUser.name];
    const wasICalled = myStatus === 'called' || myStatus === 'present';

    const membersToCall = participants.filter((p) =>
        p.role !== ROLES.PRESIDENT &&
        p.role !== ROLES.VICE_PRESIDENT &&
        p.role !== ROLES.SECRETARY
    );

    const canConductRollCall = currentUser.role === ROLES.SECRETARY || isChair;

    return (
        <div className="panel" style={{ marginBottom: '1.5rem' }}>
            <h3>Roll Call</h3>

            {canConductRollCall ? (
                <div>
                    <div className="info-box" style={{ marginBottom: '1rem' }}>
                        <strong>Note:</strong> Chair, Vice Chair, and Secretary are automatically present (officers conducting the meeting).
                    </div>

                    {membersToCall.length === 0 ? (
                        <div>
                            <p style={{ marginBottom: '0.5rem', color: '#444' }}>
                                All officers are present. No members to call.
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                Click "Complete Roll Call" to proceed.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p style={{ marginBottom: '0.75rem', color: '#444' }}>
                                Call each member. Click "Complete Roll Call" when all have responded.
                            </p>

                            <div className="roll-call-grid">
                                {membersToCall.map((p, idx) => {
                                    const status = rollCallStatus[p.name];
                                    const statusLabel = status === 'present' ? 'Present' : status === 'called' ? 'Awaiting...' : 'Click to call';
                                    return (
                                        <div key={idx}>
                                            <button
                                                type="button"
                                                onClick={() => onCallMember(p.name)}
                                                disabled={status === 'present'}
                                                className={`roll-call-member ${status === 'present' ? 'present' : ''}`}
                                            >
                                                <div className="member-name">{p.name}</div>
                                                <div className="member-role">{p.role}</div>
                                                <div className="member-status">{statusLabel}</div>
                                            </button>

                                            {status === 'called' && (
                                                <button
                                                    type="button"
                                                    onClick={() => onMarkPresent(p.name)}
                                                    className="success"
                                                    style={{ marginTop: '0.35rem', width: '100%', minHeight: '36px' }}
                                                >
                                                    Mark Present
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    {currentUser.role === ROLES.PRESIDENT || currentUser.role === ROLES.VICE_PRESIDENT ? (
                        <div className="info-box">
                            <strong>As {currentUser.role}, you are automatically present (presiding officer).</strong>
                            <p style={{ marginTop: '0.5rem' }}>The Secretary is conducting roll call.</p>
                        </div>
                    ) : currentUser.role === ROLES.SECRETARY ? (
                        <div className="info-box">
                            <strong>As Secretary, you are automatically present (conducting roll call).</strong>
                        </div>
                    ) : !wasICalled ? (
                        <p style={{ color: '#666' }}>Waiting for your name to be called...</p>
                    ) : myStatus === 'present' ? (
                        <div className="info-box">
                            <strong>You have responded to roll call.</strong>
                        </div>
                    ) : (
                        <div>
                            <div className="warning-box" style={{ marginBottom: '1rem' }}>
                                <strong>Your name has been called!</strong>
                            </div>
                            <button type="button" onClick={onRespondToRollCall} style={{ fontSize: '1rem', padding: '0.8rem 1.4rem' }}>
                                Respond: Present
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
