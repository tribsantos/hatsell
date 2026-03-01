import { MOTION_TYPES, MOTION_CATEGORY, MOTION_STATUS } from '../constants/motionTypes';
import { MOTION_RULES, getRules } from './motionRules';
import { getCurrentPendingQuestion, getMainMotion } from './motionStack';
import { MEETING_STAGES } from '../constants/meetingStages';
import i18n from '../i18n';

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
        lastChairRuling = null,
        speakingHistory = [],
        expertMotionsEnabled = false
    } = options;

    const available = [];
    const top = getCurrentPendingQuestion(stack);
    const mainMotion = getMainMotion(stack);
    const topRules = top ? getRules(top.motionType) : null;
    const topCategory = top?.category ?? topRules?.category ?? null;
    const topPrecedence = top?.precedence ?? topRules?.precedence ?? null;

    // Check if we're in a stage where motions can be made
    const businessStages = [
        MEETING_STAGES.NEW_BUSINESS,
        MEETING_STAGES.AGENDA_ITEM,
        MEETING_STAGES.MOTION_DISCUSSION,
        MEETING_STAGES.VOTING
    ];

    // === MAIN MOTIONS ===
    // Only available when no business is pending and in an appropriate stage
    if ((stage === MEETING_STAGES.NEW_BUSINESS || stage === MEETING_STAGES.AGENDA_ITEM) && stack.length === 0) {
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

    if (expertMotionsEnabled && [
        MEETING_STAGES.NEW_BUSINESS,
        MEETING_STAGES.AGENDA_ITEM,
        MEETING_STAGES.MOTION_DISCUSSION
    ].includes(stage)) {
        available.push({
            motionType: MOTION_TYPES.UNLISTED_MOTION,
            displayName: 'Unlisted Motion',
            category: MOTION_CATEGORY.EXPERT,
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
                if (topCategory === MOTION_CATEGORY.SUBSIDIARY &&
                    rules.precedence <= topPrecedence) {
                    enabled = false;
                    reason = i18n.t('motions:reason_lower_precedence', { motion: i18n.t(`motions:display_${top.motionType}`) });
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
                        reason = i18n.t('motions:reason_only_main_motion');
                    }
                }
            }

            // Amendment degree checks
            if (motionType === MOTION_TYPES.AMEND) {
                if (!top.isAmendable) {
                    enabled = false;
                    reason = i18n.t('motions:reason_not_amendable', { motion: i18n.t(`motions:display_${top.motionType}`) });
                } else {
                    // Check degree
                    const currentDegree = top.motionType === MOTION_TYPES.AMEND ? top.degree : 0;
                    if (currentDegree >= 2) {
                        enabled = false;
                        reason = i18n.t('motions:reason_max_amendment_degree');
                    }
                }
            }

            // Only show if the top motion is actively being debated (not pending chair or second)
            if ((top.status === MOTION_STATUS.PENDING_CHAIR || top.status === MOTION_STATUS.PENDING_SECOND) && motionType !== MOTION_TYPES.AMEND) {
                enabled = false;
                reason = top.status === MOTION_STATUS.PENDING_CHAIR
                    ? i18n.t('motions:reason_awaiting_chair')
                    : i18n.t('motions:reason_awaiting_second');
            }

            // Amendments also cannot be made before the chair has stated the question
            if (motionType === MOTION_TYPES.AMEND && top.status === MOTION_STATUS.PENDING_CHAIR) {
                enabled = false;
                reason = i18n.t('motions:reason_awaiting_chair');
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
                reason = i18n.t('motions:reason_already_pending', { motion: i18n.t(`motions:display_${motionType}`) });
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
            reason: hasPendingPointOfOrder ? i18n.t('motions:reason_point_of_order_pending') : null
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
            reason: !lastChairRuling ? i18n.t('motions:reason_no_chair_ruling') : null
        });

        // Division of Assembly - only during/just after a vote
        available.push({
            motionType: MOTION_TYPES.DIVISION_OF_ASSEMBLY,
            displayName: 'Division of the Assembly',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: stage === MEETING_STAGES.VOTING || (top && top.status === MOTION_STATUS.VOTING),
            reason: stage !== MEETING_STAGES.VOTING ? i18n.t('motions:reason_division_only_voting') : null
        });

        // Division of a Question - only when a divisible main question is pending
        const canDivideQuestion = !!top &&
            (top.motionType === MOTION_TYPES.MAIN || top.motionType === MOTION_TYPES.MAIN_INCIDENTAL) &&
            (top.status === MOTION_STATUS.DEBATING || top.status === MOTION_STATUS.PENDING_SECOND);
        available.push({
            motionType: MOTION_TYPES.DIVISION_OF_QUESTION,
            displayName: 'Division of a Question',
            category: MOTION_CATEGORY.INCIDENTAL,
            enabled: canDivideQuestion,
            reason: !canDivideQuestion ? i18n.t('motions:reason_division_question_only_pending_main') : null
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

        // Objection to Consideration - only against a main motion, before debate has begun
        // RONR: Must be raised before any member has spoken in debate on the motion
        if (mainMotion && top === mainMotion &&
            (top.status === MOTION_STATUS.PENDING_CHAIR || top.status === MOTION_STATUS.PENDING_SECOND || top.status === MOTION_STATUS.DEBATING)) {
            const debateHasBegun = speakingHistory.length > 0;
            available.push({
                motionType: MOTION_TYPES.OBJECTION_TO_CONSIDERATION,
                displayName: 'Objection to Consideration',
                category: MOTION_CATEGORY.INCIDENTAL,
                enabled: !debateHasBegun,
                reason: debateHasBegun ? i18n.t('motions:reason_debate_begun') : null
            });
        }
    }

    // === BRING-BACK MOTIONS ===
    if ((stage === MEETING_STAGES.NEW_BUSINESS || stage === MEETING_STAGES.AGENDA_ITEM) && stack.length === 0) {
        available.push({
            motionType: MOTION_TYPES.TAKE_FROM_TABLE,
            displayName: 'Take from the Table',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: tabledMotions.length > 0,
            reason: tabledMotions.length === 0 ? i18n.t('motions:reason_no_tabled_motions') : null
        });

        available.push({
            motionType: MOTION_TYPES.RECONSIDER,
            displayName: 'Reconsider',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: decidedMotions.length > 0,
            reason: decidedMotions.length === 0 ? i18n.t('motions:reason_no_motions_reconsider') : null
        });

        available.push({
            motionType: MOTION_TYPES.RECONSIDER_ENTER_MINUTES,
            displayName: 'Reconsider and Enter on the Minutes',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: decidedMotions.length > 0,
            reason: decidedMotions.length === 0 ? i18n.t('motions:reason_no_motions_reconsider') : null
        });

        available.push({
            motionType: MOTION_TYPES.DISCHARGE_COMMITTEE,
            displayName: 'Discharge a Committee',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: decidedMotions.some(m => m.motionType === MOTION_TYPES.COMMIT && m.result === 'adopted'),
            reason: !decidedMotions.some(m => m.motionType === MOTION_TYPES.COMMIT && m.result === 'adopted')
                ? i18n.t('motions:reason_no_committed_motions')
                : null
        });

        available.push({
            motionType: MOTION_TYPES.RESCIND,
            displayName: 'Rescind/Amend Previously Adopted',
            category: MOTION_CATEGORY.BRING_BACK,
            enabled: decidedMotions.some(m => m.result === 'adopted'),
            reason: !decidedMotions.some(m => m.result === 'adopted') ? i18n.t('motions:reason_no_adopted_motions') : null
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
