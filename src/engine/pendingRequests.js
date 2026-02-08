import { MOTION_TYPES, REQUEST_STATUS } from '../constants/motionTypes';

let nextRequestId = 1;

/**
 * Request types that use the pending request flow (chair interaction, not motion stack)
 */
export const REQUEST_TYPES = {
    PARLIAMENTARY_INQUIRY: MOTION_TYPES.PARLIAMENTARY_INQUIRY,
    REQUEST_FOR_INFO: MOTION_TYPES.REQUEST_FOR_INFO,
    POINT_OF_ORDER: MOTION_TYPES.POINT_OF_ORDER,
    QUESTION_OF_PRIVILEGE: MOTION_TYPES.QUESTION_OF_PRIVILEGE,
    WITHDRAW_MOTION: MOTION_TYPES.WITHDRAW_MOTION
};

/**
 * Flow definitions for each request type
 */
export const REQUEST_FLOWS = {
    [MOTION_TYPES.PARLIAMENTARY_INQUIRY]: {
        displayName: 'Parliamentary Inquiry',
        requiresContent: true,
        contentLabel: 'State your parliamentary inquiry',
        contentPlaceholder: 'I rise to a parliamentary inquiry: ...',
        chairActions: ['accept', 'dismiss'],
        chairResponseRequired: true,
        responsePlaceholder: 'The chair responds: ...',
        canInterrupt: true
    },
    [MOTION_TYPES.REQUEST_FOR_INFO]: {
        displayName: 'Request for Information',
        requiresContent: true,
        contentLabel: 'State your question',
        contentPlaceholder: 'I rise for a point of information: ...',
        chairActions: ['accept', 'dismiss'],
        chairResponseRequired: true,
        responsePlaceholder: 'The chair responds: ...',
        canInterrupt: true
    },
    [MOTION_TYPES.POINT_OF_ORDER]: {
        displayName: 'Point of Order',
        requiresContent: true,
        contentLabel: 'State your concern',
        contentPlaceholder: 'Point of order: ...',
        chairActions: ['sustain', 'not_sustain'],
        chairResponseRequired: false,
        canInterrupt: true
    },
    [MOTION_TYPES.QUESTION_OF_PRIVILEGE]: {
        displayName: 'Question of Privilege',
        requiresContent: true,
        contentLabel: 'State the matter of privilege',
        contentPlaceholder: 'I rise to a question of privilege: ...',
        chairActions: ['accept', 'dismiss'],
        chairResponseRequired: true,
        responsePlaceholder: 'The chair rules: ...',
        canInterrupt: true
    },
    [MOTION_TYPES.WITHDRAW_MOTION]: {
        displayName: 'Request to Withdraw',
        requiresContent: false,
        chairActions: ['grant', 'deny'],
        chairResponseRequired: false,
        canInterrupt: false
    }
};

/**
 * Create a new pending request
 */
export function createRequest(type, raisedBy, content = '') {
    const flow = REQUEST_FLOWS[type];
    if (!flow) {
        return { error: `Unknown request type: ${type}` };
    }

    return {
        id: `request_${nextRequestId++}`,
        type,
        displayName: flow.displayName,
        raisedBy,
        status: REQUEST_STATUS.PENDING,
        content,
        response: null,
        timestamp: Date.now()
    };
}

/**
 * Accept a pending request (chair acknowledges it)
 */
export function acceptRequest(requests, requestId) {
    return requests.map(r =>
        r.id === requestId ? { ...r, status: REQUEST_STATUS.ACCEPTED } : r
    );
}

/**
 * Respond to a pending request (chair provides answer)
 */
export function respondToRequest(requests, requestId, response) {
    return requests.map(r =>
        r.id === requestId ? { ...r, status: REQUEST_STATUS.RESPONDED, response } : r
    );
}

/**
 * Dismiss a pending request
 */
export function dismissRequest(requests, requestId) {
    return requests.map(r =>
        r.id === requestId ? { ...r, status: REQUEST_STATUS.DISMISSED } : r
    );
}

/**
 * Remove resolved requests from the list
 */
export function cleanupRequests(requests) {
    return requests.filter(r =>
        r.status !== REQUEST_STATUS.RESPONDED && r.status !== REQUEST_STATUS.DISMISSED
    );
}

/**
 * Get the flow definition for a request type
 */
export function getRequestFlow(type) {
    return REQUEST_FLOWS[type] || null;
}

/**
 * Reset the request ID counter
 */
export function resetRequestIdCounter() {
    nextRequestId = 1;
}
