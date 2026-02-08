import React from 'react';
import { ROLES } from '../constants';

export default function RollCallSection({ participants, rollCallStatus, currentUser, isChair, onCallMember, onRespondToRollCall, onMarkPresent }) {
    const myStatus = rollCallStatus[currentUser.name];
    const wasICalled = myStatus === 'called' || myStatus === 'present';

    const membersToCall = participants.filter(p =>
        p.role !== ROLES.PRESIDENT &&
        p.role !== ROLES.VICE_PRESIDENT &&
        p.role !== ROLES.SECRETARY
    );

    const canConductRollCall = currentUser.role === ROLES.SECRETARY || isChair;

    return (
        <div style={{background: '#f9f8f5', padding: '2rem', borderRadius: '8px', marginBottom: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem', color: '#7b2d3b'}}>Roll Call</h3>

            {canConductRollCall ? (
                <div>
                    <div className="info-box" style={{marginBottom: '1.5rem'}}>
                        <strong>Note:</strong> President, Vice President, and Secretary are automatically present (officers conducting the meeting).
                    </div>
                    {membersToCall.length === 0 ? (
                        <div>
                            <p style={{marginBottom: '1.5rem', color: '#444'}}>
                                All officers are present. No members to call.
                            </p>
                            <p style={{fontSize: '0.9rem', color: '#666'}}>
                                Click "Complete Roll Call" to proceed.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p style={{marginBottom: '1.5rem', color: '#444'}}>
                                Call each member. Click "Complete Roll Call" when all have responded.
                            </p>
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'}}>
                                {membersToCall.map((p, idx) => {
                                    const status = rollCallStatus[p.name];
                                    return (
                                        <div key={idx} style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                                            <button
                                                onClick={() => onCallMember(p.name)}
                                                disabled={status === 'present'}
                                                style={{
                                                    padding: '1rem',
                                                    background: status === 'present'
                                                        ? 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)'
                                                        : status === 'called'
                                                        ? 'rgba(230, 126, 34, 0.12)'
                                                        : 'rgba(0, 0, 0, 0.04)',
                                                    border: status === 'present' ? 'none' : '1px solid rgba(192, 57, 43, 0.2)',
                                                    color: status === 'present' ? 'white' : '#1a1a1a'
                                                }}
                                            >
                                                <div style={{fontWeight: '600'}}>{p.name}</div>
                                                <div style={{fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.7}}>
                                                    {p.role}
                                                </div>
                                                <div style={{fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.8}}>
                                                    {status === 'present' ? 'Present' : status === 'called' ? 'Awaiting...' : 'Click to call'}
                                                </div>
                                            </button>
                                            {status === 'called' && (
                                                <button
                                                    onClick={() => onMarkPresent(p.name)}
                                                    style={{
                                                        padding: '0.4rem',
                                                        fontSize: '0.8rem',
                                                        background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
                                                        color: 'white'
                                                    }}
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
                <div style={{textAlign: 'center'}}>
                    {currentUser.role === ROLES.PRESIDENT || currentUser.role === ROLES.VICE_PRESIDENT ? (
                        <div className="info-box">
                            <strong>As {currentUser.role}, you are automatically present (presiding officer).</strong>
                            <p style={{marginTop: '0.5rem'}}>The Secretary is conducting roll call.</p>
                        </div>
                    ) : currentUser.role === ROLES.SECRETARY ? (
                        <div className="info-box">
                            <strong>As Secretary, you are automatically present (conducting roll call).</strong>
                        </div>
                    ) : !wasICalled ? (
                        <p style={{color: '#666'}}>Waiting for your name to be called...</p>
                    ) : myStatus === 'present' ? (
                        <div className="info-box">
                            <strong>✓ You have responded to roll call.</strong>
                        </div>
                    ) : (
                        <div>
                            <div className="warning-box" style={{marginBottom: '1.5rem'}}>
                                <strong>Your name has been called!</strong>
                            </div>
                            <button onClick={onRespondToRollCall} style={{fontSize: '1.2rem', padding: '1rem 2rem'}}>
                                Respond: Present
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
