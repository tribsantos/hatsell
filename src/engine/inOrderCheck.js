import { MOTION_TYPES, MOTION_CATEGORY, MOTION_STATUS } from '../constants/motionTypes';
import { MOTION_RULES, getRules } from './motionRules';
import { getCurrentPendingQuestion, getMainMotion } from './motionStack';
import { MEETING_STAGES } from '../constants/meetingStages';

/**
 * Determine which motions are currently in order based on:
 * - Current motion stack state
 * - Meeting stage
 * - User role
 * - Other contextual options
 *
 * Returns an array of { motionType, displayName, category, enabled, reason }
 */
export function getAvailableMotions(stack, stage, user, options = {}) {
    const {
        hasPendingPointOfOrder = false,
        tabledMotions = [],
        decidedMotions = [],
        isChair = false,
        lastChairRuling = null
    } = options;

    const available = [];
    const top = getCurrentPendingQuestion(stack);
    const mainMotion = getMainMotion(stack);
    const topRules = top ? getRules(top.motionType) : null;

    // Check if we're in a stage where motions can be made
    const businessStages = [
        MEETING_STAGES.NEW_BUSINESS,
        MEETING_STAGES.MOTION_DISCUSSION,
        MEETING_STAGES.VOTING
    ];

    // === MAIN MOTIONS ===
    // Only available when no business is pending and in an appropriate stage
    if (stage === MEETING_STAGES.NEW_BUSINESS && stack.length === 0) {
        available.push({
            motionType: MOTION_TYPES.MAIN,
            displayName: 'Main Motion',
            category: MOTION_CATEGORY.MAIN,
            enabled: true,
            reason: null
        });
        available.push({
            motionType: MOTION_TYPES.MAIN_INCIDENTAL,
            displayName: 'Incidental Main Motion',
            category: MOTION_CATEGORY.MAIN,
            enabled: true,
            reason: null
        });
    }

    // === SUBSIDIARY MOTIONS ===
    // Only available when a main motion is pending and the top question is being debated
    if (stack.length > 0 && top && (top.status === MOTION_STATUS.DEBATING || top.status === MOTION_STATUS.PENDING_SECOND || top.status === MOTION_STATUS.PENDING_CHAIR)) {
        const subsidiaryTypes = [
            MOTION_TYPES.POSTPONE_INDEFINITELY,
            MOTION_TYPES.AMEND,
            MOTION_TYPES.COMMIT,
            MOTION_TYPES.POSTPONE_DEFINITELY,
            MOTION_TYPES.LIMIT_DEBATE,
            MOTION_TYPES.PREVIOUS_QUESTION,
            MOTION_TYPES.LAY_ON_TABLE
        ];

        for (const motionType of subsidiaryTypes) {
            const rules = getRules(motionType);
            let enabled = true;
            let reason = null;

            // Precedence check: must outrank what's currently on top (unless it's an amendment)
            if (motionType !== MOTION_TYPES.AMEND) {
                if (topRules && topRules.category === MOTION_CATEGORY.SUBSIDIARY &&
                    rules.precedence <= topRules.precedence) {
                    enabled = false;
                    reason = `Cannot make while ${topRules.displayName} is pending (lower precedence)`;
                }
            }

            // Postpone Indefinitely only applies to main motions
            if (motionType === MOTION_TYPES.POSTPONE_INDEFINITELY) {
                if (!mainMotion || top !== mainMotion) {
                    // Can only be applied when main motion is the immediately pending question
                    // Actually, it can be made when main is pending but subsidiary is higher
                    // For simplicity: only available when on top is the main motion
                    if (top.motionType !== MOTION_TYPES.MAIN && top.motionType !== MOTION_TYPES.MAIN_INCIDENTAL) {
                        enabled = false;
                        reason = 'Can only apply to the main motion when it is the immediately pending question';
                    }
                }
            }

            // Amendment degree checks
            if (motionType === MOTION_TYPES.AMEND) {
                if (!top.isAmendable) {
                    enabled = false;
                    reason = `${top.displayName || 'Current motion'} is not amendable`;
                } else {
                    // Check degree
                    const currentDegree = top.motionType === MOTION_TYPES.AMEND ? top.degree : 0;
                    if (currentDegree >= 2) {
                        enabled = false;
                        reason = 'Cannot exceed two degrees of amendment';
                    }
                }
            }

            // Only show if the top motion is actively being debated (not pending chair or second)
            if ((top.status === MOTION_STATUS.PENDING_CHAIR || top.status === MOTION_STATUS.PENDING_SECOND) && motionType !== MOTION_TYPES.AMEND) {
                enabled = false;
                reason = top.status === MOTION_STATUS.PENDING_CHAIR
                    ? 'Motion awaiting chair recognition'
                    : 'Motion is awaiting a second';
            }

            // Amendments also cannot be made before the chair has stated the question
            if (motionType === MOTION_TYPES.AMEND && top.status === MOTION_STATUS.PENDING_CHAIR) {
                enabled = false;
                reason = 'Motion awaiting chair recognition';
            }

            // Lay on Table only applies to main motion
            if (motionType === MOTION_TYPES.LAY_ON_TABLE && stack.length > 0) {
                // Lay on Table takes the entire main motion with all pending subsidiaries
                // It's in order when any subsidiary is pending
            }

            available.push({
                motionType,
                displayName: rules.displayName,
                category: MOTION_CATEGORY.SUBSIDIARY,
                enabled,
                reason
            });
        }
    }

    // === PRIVILEGED MOTIONS ===
    // Available in most business stages
    if (businessStages.includes(stage) || stage === MEETING_STAGES.MOTION_DISCUSSION) {
        const privilegedTypes = [
            MOTION_TYPES.ORDERS_OF_DAY,
            MOTION_TYPES.QUESTION_OF_PRIVILEGE,
            MOTION_TYPES.RECESS,
            MOTION_TYPES.ADJOURN,
            MOTION_TYPES.FIX_TIME_TO_ADJOURN
        ];

        for (const motionType of privilegedTypes) {
            const rules = getRules(motionType);
            let enabled = true;
            let reason = null;

            // Check if already pending on the stack
            const alreadyPending = stack.some(m => m.motionType === motionType &&
                m.status !== MOTION_STATUS.ADOPTED && m.status !== MOTION_STATUS.DEFEATED);
            if (alreadyPending) {
                enabled = false;
                reason = `${rules.displayName} is already pending`;
            }

            available.push({
                motionType,
                displayName: rules.displayName,
                category: MOTION_CATEGORY.PRIVILEGED,
                enabled,
                reason
            });
        }
    }

    // Adjourn is also available when no business pending (as a main motion form)
    if (stage === MEETING_STAGES.NEW_BUSINESS && stack.length === 0) {
        // Already covered above; it's a privileged motion
    }

    // === INCIDENTAL MOTIONS ===
    // Most are available at any time during a meeting
    if (stage !== MEETING_STAGES.NOT_STARTED && stage !== MEETING_STAGES.ADJOURNED) {
        available.push({
            motionType: MOTION_TYPES.POINT_OF_ORDER,
            displayName: 'Point of Order',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: !hasPendingPointOfOrder,
            reason: hasPendingPointOfOrder ? 'A point of order is already pending' : null
        });

        available.push({
            motionType: MOTION_TYPES.PARLIAMENTARY_INQUIRY,
            displayName: 'Parliamentary Inquiry',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: true,
            reason: null
        });

        available.push({
            motionType: MOTION_TYPES.REQUEST_FOR_INFO,
            displayName: 'Request for Information',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: true,
            reason: null
        });

        // Appeal - only after a chair ruling
        available.push({
            motionType: MOTION_TYPES.APPEAL,
            displayName: 'Appeal the Decision of the Chair',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: !!lastChairRuling,
            reason: !lastChairRuling ? 'No recent chair ruling to appeal' : null
        });

        // Division of Assembly - only during/just after a vote
        available.push({
            motionType: MOTION_TYPES.DIVISION_OF_ASSEMBLY,
            displayName: 'Division of the Assembly',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: stage === MEETING_STAGES.VOTING || (top && top.status === MOTION_STATUS.VOTING),
            reason: stage !== MEETING_STAGES.VOTING ? 'Division can only be demanded during voting' : null
        });

        // Suspend Rules
        available.push({
            motionType: MOTION_TYPES.SUSPEND_RULES,
            displayName: 'Suspend the Rules',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: true,
            reason: null
        });

        // Withdraw Motion - only if there's a pending motion and the user is the mover
        if (stack.length > 0) {
            available.push({
                motionType: MOTION_TYPES.WITHDRAW_MOTION,
                displayName: 'Withdraw a Motion',
                category: MOTION_CATEGORY.INCIDENTAL,
                enabled: true,
                reason: null
            });
        }

        // Objection to Consideration - only against a main motion, before debate has progressed
        if (mainMotion && top === mainMotion &&
            (top.status === MOTION_STATUS.PENDING_CHAIR || top.status === MOTION_STATUS.PENDING_SECOND || top.status === MOTION_STATUS.DEBATING)) {
            available.push({
                motionType: MOTION_TYPES.OBJECTION_TO_CONSIDERATION,
                displayName: 'Objection to Consideration',
                category: MOTION_CATEGORY.INCIDENTAL,
                enabled: true,
                reason: null
            });
        }
    }

    // === BRING-BACK MOTIONS ===
    if (stage === MEETING_STAGES.NEW_BUSINESS && stack.length === 0) {
        available.push({
            motionType: MOTION_TYPES.TAKE_FROM_TABLE,
            displayName: 'Take from the Table',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: tabledMotions.length > 0,
            reason: tabledMotions.length === 0 ? 'No motions have been tabled' : null
        });

        available.push({
            motionType: MOTION_TYPES.RECONSIDER,
            displayName: 'Reconsider',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: decidedMotions.length > 0,
            reason: decidedMotions.length === 0 ? 'No motions available to reconsider' : null
        });

        available.push({
            motionType: MOTION_TYPES.RESCIND,
            displayName: 'Rescind/Amend Previously Adopted',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: decidedMotions.some(m => m.result === 'adopted'),
            reason: !decidedMotions.some(m => m.result === 'adopted') ? 'No adopted motions to rescind' : null
        });
    }

    return available;
}

/**
 * Get only the enabled motions from the available list
 */
export function getEnabledMotions(stack, stage, user, options) {
    return getAvailableMotions(stack, stage, user, options).filter(m => m.enabled);
}

/**
 * Check if a specific motion type is currently in order
 */
export function isMotionInOrder(motionType, stack, stage, user, options) {
    const available = getAvailableMotions(stack, stage, user, options);
    const motion = available.find(m => m.motionType === motionType);
    return motion ? motion.enabled : false;
}
