import React, { useState } from 'react';
import { REQUEST_STATUS } from '../constants/motionTypes';
import { REQUEST_FLOWS } from '../engine/pendingRequests';

export default function PendingRequestsPanel({
    pendingRequests,
    isChair,
    currentUser,
    onAcceptRequest,
    onRespondToRequest,
    onDismissRequest,
    onRuleOnPointOfOrder,
    onConvertToMotion
}) {
    const [responseText, setResponseText] = useState({});

    if (!pendingRequests || pendingRequests.length === 0) return null;

    const activeRequests = pendingRequests.filter(r =>
        r.status !== REQUEST_STATUS.DISMISSED
    );

    if (activeRequests.length === 0) return null;

    const handleResponseChange = (requestId, text) => {
        setResponseText(prev => ({ ...prev, [requestId]: text }));
    };

    const handleSubmitResponse = (requestId) => {
        const text = responseText[requestId] || '';
        if (!text.trim()) return;
        onRespondToRequest(requestId, text);
        setResponseText(prev => {
            const next = { ...prev };
            delete next[requestId];
            return next;
        });
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#e67e22', marginBottom: '1rem' }}>
                Pending Requests ({activeRequests.length})
            </h4>
            {activeRequests.map(request => {
                const flow = REQUEST_FLOWS[request.type];
                const isPointOfOrder = request.type === 'point_of_order';
                const isAppealable = request.type === 'point_of_order' && request.status === REQUEST_STATUS.PENDING;

                return (
                    <div key={request.id} style={{
                        background: 'rgba(230, 126, 34, 0.06)',
                        border: '1px solid rgba(230, 126, 34, 0.2)',
                        borderLeft: `4px solid ${isPointOfOrder ? '#e67e22' : '#e67e22'}`,
                        padding: '1rem',
                        borderRadius: '4px',
                        marginBottom: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <strong style={{ color: isPointOfOrder ? '#e67e22' : '#e67e22' }}>
                                    {request.displayName}
                                </strong>
                                <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                    by {request.raisedBy}
                                </span>
                            </div>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '3px',
                                background: request.status === REQUEST_STATUS.PENDING ? 'rgba(230, 126, 34, 0.12)' :
                                    request.status === REQUEST_STATUS.ACCEPTED ? 'rgba(39, 174, 96, 0.12)' :
                                        request.status === REQUEST_STATUS.RESPONDED ? 'rgba(230, 126, 34, 0.12)' : 'rgba(102, 102, 102, 0.12)',
                                color: request.status === REQUEST_STATUS.PENDING ? '#e67e22' :
                                    request.status === REQUEST_STATUS.ACCEPTED ? '#27ae60' :
                                        request.status === REQUEST_STATUS.RESPONDED ? '#e67e22' : '#666'
                            }}>
                                {request.status}
                            </span>
                        </div>

                        {request.content && (
                            <p style={{ margin: '0.75rem 0', fontStyle: 'italic', color: '#1a1a1a' }}>
                                "{request.content}"
                            </p>
                        )}

                        {request.response && (
                            <div style={{
                                margin: '0.75rem 0',
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(192, 57, 43, 0.06)',
                                borderLeft: '3px solid #c0392b',
                                borderRadius: '2px'
                            }}>
                                <strong style={{ color: '#c0392b', fontSize: '0.85rem' }}>Chair's Response:</strong>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#1a1a1a' }}>{request.response}</p>
                            </div>
                        )}

                        {/* Chair actions */}
                        {isChair && request.status === REQUEST_STATUS.PENDING && (
                            <div style={{ marginTop: '0.75rem' }}>
                                {isPointOfOrder ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => onRuleOnPointOfOrder(request.id, 'sustained')}
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                        >
                                            Sustain
                                        </button>
                                        <button
                                            onClick={() => onRuleOnPointOfOrder(request.id, 'not sustained')}
                                            className="secondary"
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                        >
                                            Not Sustained
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => onAcceptRequest(request.id)}
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => onDismissRequest(request.id)}
                                            className="secondary"
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Chair response input (for accepted requests needing a response) */}
                        {isChair && request.status === REQUEST_STATUS.ACCEPTED && flow?.chairResponseRequired && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <textarea
                                    value={responseText[request.id] || ''}
                                    onChange={(e) => handleResponseChange(request.id, e.target.value)}
                                    placeholder={flow.responsePlaceholder || 'Enter your response...'}
                                    style={{
                                        width: '100%',
                                        minHeight: '60px',
                                        padding: '0.5rem',
                                        background: '#f9f8f5',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        color: '#1a1a1a',
                                        resize: 'vertical',
                                        marginBottom: '0.5rem'
                                    }}
                                />
                                <button
                                    onClick={() => handleSubmitResponse(request.id)}
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                                >
                                    Send Response
                                </button>
                            </div>
                        )}

                        {/* Member-facing: show prompt when accepted */}
                        {!isChair && request.raisedBy === currentUser?.name &&
                            request.status === REQUEST_STATUS.ACCEPTED && (
                                <div style={{
                                    marginTop: '0.75rem',
                                    padding: '0.5rem 0.75rem',
                                    background: 'rgba(39, 174, 96, 0.08)',
                                    borderRadius: '4px',
                                    color: '#1e8449'
                                }}>
                                    The chair has recognized your {request.displayName.toLowerCase()}.
                                    {flow?.chairResponseRequired && ' Awaiting the chair\'s response.'}
                                </div>
                            )}

                        {/* Dismiss responded requests */}
                        {request.status === REQUEST_STATUS.RESPONDED && isChair && (
                            <button
                                onClick={() => onDismissRequest(request.id)}
                                className="secondary"
                                style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
