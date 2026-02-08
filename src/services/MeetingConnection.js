const STORAGE_KEY = 'parliamentary_meeting_state';
const STATE_VERSION = 2; // v2: motionStack replaces currentMotion

export function broadcast(newState) {
    const versionedState = { ...newState, stateVersion: STATE_VERSION };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versionedState));
    window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(versionedState)
    }));
}

export function subscribe(callback) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            callback(JSON.parse(stored));
        } catch (e) {
            console.error('Error parsing stored state:', e);
        }
    }

    const handler = (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
            try {
                callback(JSON.parse(e.newValue));
            } catch (err) {
                console.error('Error parsing state update:', err);
            }
        }
    };

    window.addEventListener('storage', handler);

    return () => {
        window.removeEventListener('storage', handler);
    };
}

export function getState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored state:', e);
            return null;
        }
    }
    return null;
}

export function clearState() {
    localStorage.removeItem(STORAGE_KEY);
}
