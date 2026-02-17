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

    const activeRequests = pendingRequests.filter((r) => r.status !== REQUEST_STATUS.DISMISSED);
    if (activeRequests.length === 0) return null;

    const handleResponseChange = (requestId, text) => {
        setResponseText((prev) => ({ ...prev, [requestId]: text }));
    };

    const handleSubmitResponse = (requestId) => {
        const text = responseText[requestId] || '';
        if (!text.trim()) return;
        onRespondToRequest(requestId, text);
        setResponseText((prev) => {
            const next = { ...prev };
            delete next[requestId];
            return next;
        });
    };

    return (
        <div className="panel" style={{ marginBottom: '1.25rem' }}>
            <h3>Pending Requests ({activeRequests.length})</h3>
            {activeRequests.map((request) => {
                const flow = REQUEST_FLOWS[request.type];
                const isPointOfOrder = request.type === 'point_of_order';

                return (
                    <div key={request.id} className="pending-request" style={{ alignItems: 'stretch', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div>
                                <strong>{request.displayName}</strong>
                                <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                    by {request.raisedBy}
                                </span>
                            </div>
                            <span className="motion-status-badge pending_second" style={{ textTransform: 'capitalize' }}>
                                {request.status}
                            </span>
                        </div>

                        {request.content && (
                            <p style={{ margin: '0.6rem 0', fontStyle: 'italic', color: '#1a1a1a' }}>
                                "{request.content}"
                            </p>
                        )}

                        {request.response && (
                            <div className="info-box" style={{ margin: '0.4rem 0 0 0' }}>
                                <strong>Chair response:</strong> {request.response}
                            </div>
                        )}

                        {isChair && request.status === REQUEST_STATUS.PENDING && (
                            <div className="request-actions" style={{ marginTop: '0.6rem' }}>
                                {isPointOfOrder ? (
                                    <>
                                        <button type="button" onClick={() => onRuleOnPointOfOrder(request.id, 'sustained')} className="success">
                                            Sustain
                                        </button>
                                        <button type="button" onClick={() => onRuleOnPointOfOrder(request.id, 'not sustained')} className="ghost">
                                            Not Sustained
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => onAcceptRequest(request.id)} className="success">
                                            Accept
                                        </button>
                                        <button type="button" onClick={() => onDismissRequest(request.id)} className="ghost">
                                            Dismiss
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {isChair && request.status === REQUEST_STATUS.ACCEPTED && flow?.chairResponseRequired && (
                            <div style={{ marginTop: '0.6rem' }}>
                                <textarea
                                    value={responseText[request.id] || ''}
                                    onChange={(e) => handleResponseChange(request.id, e.target.value)}
                                    placeholder={flow.responsePlaceholder || 'Enter your response...'}
                                    style={{ marginBottom: '0.5rem' }}
                                />
                                <button type="button" onClick={() => handleSubmitResponse(request.id)} style={{ width: '100%' }}>
                                    Send Response
                                </button>
                            </div>
                        )}

                        {!isChair && request.raisedBy === currentUser?.name && request.status === REQUEST_STATUS.ACCEPTED && (
                            <div className="info-box" style={{ marginTop: '0.6rem' }}>
                                The chair has recognized your {request.displayName.toLowerCase()}.
                                {flow?.chairResponseRequired && ' Awaiting the chair\'s response.'}
                            </div>
                        )}

                        {request.status === REQUEST_STATUS.RESPONDED && isChair && (
                            <button
                                type="button"
                                onClick={() => onDismissRequest(request.id)}
                                className="ghost"
                                style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}
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
