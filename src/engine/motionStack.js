import { MOTION_TYPES, MOTION_STATUS, VOTE_THRESHOLDS, MOTION_CATEGORY } from '../constants/motionTypes';
import { MOTION_RULES, getRules } from './motionRules';

let nextMotionId = Date.now();

/**
 * Create a new motion entry with rules auto-populated from the rules database
 */
export function createMotionEntry(motionType, text, mover, metadata = {}) {
    const rules = getRules(motionType);
    if (!rules) {
        return { error: `Unknown motion type: ${motionType}` };
    }

    const degree = metadata.degree || (motionType === MOTION_TYPES.AMEND ? 1 : 0);

    return {
        id: `motion_${nextMotionId++}`,
        motionType,
        text,
        mover,
        seconder: null,
        status: rules.requiresSecond ? MOTION_STATUS.PENDING_CHAIR : MOTION_STATUS.DEBATING,
        degree,
        appliedTo: metadata.appliedTo || null,
        votes: { aye: 0, nay: 0, abstain: 0 },
        votedBy: [],
        voteRequired: rules.voteRequired,
        isDebatable: rules.isDebatable,
        isAmendable: rules.isAmendable,
        requiresSecond: rules.requiresSecond,
        category: rules.category,
        displayName: rules.displayName,
        precedence: rules.precedence,
        metadata
    };
}

/**
 * Push a motion onto the stack, validating precedence rules
 * Returns { newStack, error }
 */
export function pushMotion(stack, entry) {
    if (!entry || entry.error) {
        return { newStack: stack, error: entry?.error || 'Invalid motion entry' };
    }

    const rules = getRules(entry.motionType);
    if (!rules) {
        return { newStack: stack, error: `No rules found for motion type: ${entry.motionType}` };
    }

    // Main motions can only be made when the stack is empty
    if (rules.category === MOTION_CATEGORY.MAIN && stack.length > 0) {
        return { newStack: stack, error: 'A main motion cannot be made while another motion is pending.' };
    }

    // For subsidiary motions, check precedence
    if (rules.category === MOTION_CATEGORY.SUBSIDIARY && stack.length > 0) {
        const topMotion = stack[stack.length - 1];
        const topRules = getRules(topMotion.motionType);

        // Amendment degree check
        if (entry.motionType === MOTION_TYPES.AMEND) {
            const maxDegree = rules.maxDegree || 2;
            if (entry.degree > maxDegree) {
                return { newStack: stack, error: `Cannot exceed ${maxDegree} degrees of amendment.` };
            }
            // Check there isn't already an amendment of the same degree pending
            const sameDegreeExists = stack.some(m =>
                m.motionType === MOTION_TYPES.AMEND && m.degree === entry.degree &&
                m.status !== MOTION_STATUS.ADOPTED && m.status !== MOTION_STATUS.DEFEATED
            );
            if (sameDegreeExists) {
                return { newStack: stack, error: `An amendment of degree ${entry.degree} is already pending.` };
            }
        } else {
            // Non-amendment subsidiary: must outrank top of stack
            if (topRules && topRules.category === MOTION_CATEGORY.SUBSIDIARY &&
                rules.precedence !== null && topRules.precedence !== null &&
                rules.precedence <= topRules.precedence) {
                return {
                    newStack: stack,
                    error: `${rules.displayName} (precedence ${rules.precedence}) cannot be made while ${topRules.displayName} (precedence ${topRules.precedence}) is pending.`
                };
            }
        }
    }

    // Privileged motions can always be made when in order
    // Incidental motions have no precedence among themselves

    return { newStack: [...stack, entry], error: null };
}

/**
 * Pop the top motion from the stack
 * Returns { newStack, poppedMotion }
 */
export function popMotion(stack) {
    if (stack.length === 0) {
        return { newStack: [], poppedMotion: null };
    }
    const newStack = stack.slice(0, -1);
    const poppedMotion = stack[stack.length - 1];
    return { newStack, poppedMotion };
}

/**
 * Get the currently pending question (top of stack)
 */
export function getCurrentPendingQuestion(stack) {
    if (stack.length === 0) return null;
    return stack[stack.length - 1];
}

/**
 * Get the main motion (bottom of stack, index 0)
 */
export function getMainMotion(stack) {
    if (stack.length === 0) return null;
    return stack[0];
}

/**
 * Determine the vote result based on the motion's vote threshold
 * Returns { result: 'adopted'|'defeated', description }
 *
 * votingContext (optional): { majorityBasis, twoThirdsBasis, membersPresent, entireMembership }
 *   basis values: 'votes_cast' (default RONR) | 'members_present' | 'entire_membership'
 */
export function determineVoteResult(entry, votingContext) {
    const { votes, voteRequired } = entry;
    const aye = votes.aye || 0;
    const nay = votes.nay || 0;
    // Abstentions do NOT count as votes cast per RONR
    const totalCast = aye + nay;

    if (totalCast === 0) {
        return { result: 'defeated', description: 'No votes cast. Motion fails.' };
    }

    // Helper to get the denominator based on voting basis
    const getDenominator = (basis) => {
        if (!votingContext) return totalCast;
        switch (basis) {
            case 'members_present':
                return votingContext.membersPresent || totalCast;
            case 'entire_membership':
                return votingContext.entireMembership || totalCast;
            default:
                return totalCast;
        }
    };

    const getBasisLabel = (basis) => {
        switch (basis) {
            case 'members_present': return ' of members present';
            case 'entire_membership': return ' of entire membership';
            default: return '';
        }
    };

    switch (voteRequired) {
        case VOTE_THRESHOLDS.MAJORITY: {
            const basis = votingContext?.majorityBasis || 'votes_cast';
            const denom = getDenominator(basis);
            const basisLabel = getBasisLabel(basis);
            if (aye > denom / 2) {
                return { result: 'adopted', description: `${aye} ayes, ${nay} nays. Majority${basisLabel} required. Motion adopted.` };
            }
            return { result: 'defeated', description: `${aye} ayes, ${nay} nays. Majority${basisLabel} required. Motion defeated.` };
        }

        case VOTE_THRESHOLDS.TWO_THIRDS: {
            const basis = votingContext?.twoThirdsBasis || 'votes_cast';
            const denom = getDenominator(basis);
            const basisLabel = getBasisLabel(basis);
            if (aye >= denom * 2 / 3) {
                return { result: 'adopted', description: `${aye} ayes, ${nay} nays. Two-thirds${basisLabel} required. Motion adopted.` };
            }
            return { result: 'defeated', description: `${aye} ayes, ${nay} nays. Two-thirds${basisLabel} required. Motion defeated.` };
        }

        case VOTE_THRESHOLDS.TIE_SUSTAINS:
            // For Appeal: tie sustains the chair's ruling
            if (aye > nay) {
                return { result: 'adopted', description: `${aye} ayes, ${nay} nays. The appeal is sustained (chair's ruling overturned).` };
            }
            return { result: 'defeated', description: `${aye} ayes, ${nay} nays. Tie or majority nay sustains the chair's decision.` };

        case VOTE_THRESHOLDS.NONE:
            // Chair decides, or demand (no formal vote)
            return { result: 'adopted', description: 'No vote required.' };

        default:
            if (aye > totalCast / 2) {
                return { result: 'adopted', description: `${aye} ayes, ${nay} nays. Motion adopted.` };
            }
            return { result: 'defeated', description: `${aye} ayes, ${nay} nays. Motion defeated.` };
    }
}

/**
 * Update the top motion on the stack with new properties
 */
export function updateTopMotion(stack, updates) {
    if (stack.length === 0) return stack;
    const newStack = [...stack];
    newStack[newStack.length - 1] = { ...newStack[newStack.length - 1], ...updates };
    return newStack;
}

/**
 * Update a specific motion in the stack by id
 */
export function updateMotionById(stack, motionId, updates) {
    return stack.map(m => m.id === motionId ? { ...m, ...updates } : m);
}

/**
 * Reset the motion ID counter (useful for testing or clearing state)
 */
export function resetMotionIdCounter() {
    nextMotionId = 1;
}
