/**
 * Quorum utilities.
 *
 * A quorum rule is: { type: 'number', value: 5 }
 *                 or { type: 'fraction', value: 'majority' | '1/3' | '2/3' }
 */

/**
 * Resolve a quorum rule to a concrete number of members required.
 * @param {object} rule - { type, value }
 * @param {number} participantCount - total enrolled members
 * @returns {number} minimum members required
 */
export function resolveQuorum(rule, participantCount) {
    if (!rule) return 0;

    if (rule.type === 'number') {
        return Math.max(1, Math.floor(rule.value));
    }

    if (rule.type === 'majority_present') {
        return Math.floor(participantCount / 2) + 1;
    }

    if (rule.type === 'fraction') {
        switch (rule.value) {
            case 'majority':
                return Math.floor(participantCount / 2) + 1;
            case '1/3':
                return Math.ceil(participantCount / 3);
            case '2/3':
                return Math.ceil((participantCount * 2) / 3);
            default:
                if (typeof rule.value === 'number') {
                    return Math.ceil(participantCount * rule.value);
                }
                return 0;
        }
    }

    return 0;
}

/**
 * Format a quorum rule as a human-readable string.
 * @param {object} rule - { type, value }
 * @returns {string}
 */
export function formatQuorumRule(rule) {
    if (!rule) return 'None set';

    if (rule.type === 'number') {
        return `${rule.value} members`;
    }

    if (rule.type === 'majority_present') {
        return 'Majority of members present';
    }

    if (rule.type === 'fraction') {
        switch (rule.value) {
            case 'majority':
                return 'Majority of total membership';
            case '1/3':
                return 'One-third of members';
            case '2/3':
                return 'Two-thirds of members';
            default:
                if (typeof rule.value === 'number') {
                    return `${Math.round(rule.value * 100)}% of membership`;
                }
                return rule.value;
        }
    }

    return 'Unknown';
}
