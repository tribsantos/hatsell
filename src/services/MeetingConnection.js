import { ref, set, get, update, onValue, off, remove } from 'firebase/database';
import { database } from './firebaseConfig';

const STATE_VERSION = 2;

// Array fields that Firebase will drop when empty (serializes [] as null)
const ARRAY_FIELDS = [
    'participants', 'motionStack', 'pendingRequests', 'tabledMotions',
    'decidedMotions', 'speakingQueue', 'speakingHistory', 'votedBy',
    'log', 'pendingAmendments', 'minutesCorrections', 'notifications',
    'voteDetails', 'pendingMotions'
];

let meetingRef = null;
let cachedState = null;
let activeListener = null;

function sanitizeForFirebase(value) {
    if (value === undefined) return null;
    if (value === null) return null;
    if (Array.isArray(value)) {
        return value.map(sanitizeForFirebase);
    }
    if (typeof value === 'object') {
        const out = {};
        for (const [key, val] of Object.entries(value)) {
            out[key] = sanitizeForFirebase(val);
        }
        return out;
    }
    return value;
}

function sanitizeState(state) {
    if (!state) return null;
    const sanitized = { ...state };
    for (const field of ARRAY_FIELDS) {
        if (sanitized[field] === null || sanitized[field] === undefined) {
            sanitized[field] = [];
        }
    }
    // Restore object fields that Firebase may nullify
    if (!sanitized.savedSpeakingState) sanitized.savedSpeakingState = {};
    if (!sanitized.votes) sanitized.votes = { aye: 0, nay: 0, abstain: 0 };
    if (!sanitized.rollCallStatus) sanitized.rollCallStatus = {};
    return sanitized;
}

export function connect(meetingCode) {
    if (meetingRef) {
        disconnect();
    }
    meetingRef = ref(database, `meetings/${meetingCode}`);
    cachedState = null;
}

export function disconnect() {
    if (meetingRef && activeListener) {
        off(meetingRef, 'value', activeListener);
        activeListener = null;
    }
    meetingRef = null;
    cachedState = null;
}

export function broadcast(newState) {
    if (!meetingRef) return Promise.resolve();
    const versionedState = { ...newState, stateVersion: STATE_VERSION };
    const cleanedState = sanitizeForFirebase(versionedState);
    return set(meetingRef, cleanedState);
}

export function subscribe(callback) {
    if (!meetingRef) return () => {};

    const handler = (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const sanitized = sanitizeState(data);
            cachedState = sanitized;
            callback(sanitized);
        }
    };

    activeListener = handler;
    onValue(meetingRef, handler);

    return () => {
        if (meetingRef) {
            off(meetingRef, 'value', handler);
        }
        if (activeListener === handler) {
            activeListener = null;
        }
    };
}

export async function getState() {
    if (!meetingRef) return null;
    const snapshot = await get(meetingRef);
    if (snapshot.exists()) {
        return sanitizeState(snapshot.val());
    }
    return null;
}

export async function clearState() {
    if (!meetingRef) return;
    await remove(meetingRef);
}

export function getCachedState() {
    return cachedState;
}

/**
 * Partial update: only modifies the specified field of a participant
 * without overwriting the entire state. Prevents race conditions where
 * a full broadcast could overwrite concurrent changes from other tabs.
 */
export function updateParticipantLastSeen(index, timestamp) {
    if (!meetingRef || index < 0) return Promise.resolve();
    return update(meetingRef, { [`participants/${index}/lastSeen`]: timestamp });
}

export async function checkMeetingExists(meetingCode) {
    const meetingSnapshot = await get(ref(database, `meetings/${meetingCode}`));
    return meetingSnapshot.exists();
}

/**
 * Register role-based codes for a meeting.
 * Creates lookup entries at code_lookups/{code} → { meetingCode, role }
 */
export async function registerRoleCodes(meetingCode, roleCodes) {
    const promises = Object.entries(roleCodes).map(([role, code]) =>
        set(ref(database, `code_lookups/${code}`), { meetingCode, role })
    );
    await Promise.all(promises);
}

/**
 * Look up a code to find which meeting it belongs to and what role it assigns.
 * Returns { meetingCode, role } or null.
 */
export async function lookupCode(code) {
    const snapshot = await get(ref(database, `code_lookups/${code}`));
    if (snapshot.exists()) {
        return snapshot.val();
    }
    return null;
}

/**
 * Clean up code lookups for a meeting.
 */
export async function clearRoleCodes(roleCodes) {
    if (!roleCodes) return;
    const promises = Object.values(roleCodes).map(code =>
        remove(ref(database, `code_lookups/${code}`))
    );
    await Promise.all(promises);
}
