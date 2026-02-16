import { getCurrentPendingQuestion } from './motionStack';
import { getRules } from './motionRules';
import { MOTION_STATUS } from '../constants/motionTypes';

/**
 * Check if debate is allowed on the currently pending question
 */
export function isDebateAllowed(stack) {
    const top = getCurrentPendingQuestion(stack);
    if (!top) return false;
    if (top.status !== MOTION_STATUS.DEBATING) return false;
    return top.isDebatable;
}

/**
 * Get debate constraints for the currently pending question.
 * Returns any time limits or speech count limits imposed by Limit Debate motions.
 * orgProfile (optional): org settings with timePerSpeech, speechesPerMember, totalDebateTime
 */
export function getDebateConstraints(stack, orgProfile) {
    const constraints = {
        isDebatable: false,
        maxSpeechesPerMember: 2,     // RONR default: 2 speeches per member per question
        maxSpeechDuration: null,      // null = no limit unless imposed
        totalTimeLimit: null,
        closedByPreviousQuestion: false
    };

    // Apply org profile defaults first (overridden by motion-specific limits)
    if (orgProfile) {
        if (orgProfile.timePerSpeech) constraints.maxSpeechDuration = parseInt(orgProfile.timePerSpeech) || null;
        if (orgProfile.speechesPerMember) constraints.maxSpeechesPerMember = parseInt(orgProfile.speechesPerMember) || 2;
        if (orgProfile.totalDebateTime) constraints.totalTimeLimit = parseInt(orgProfile.totalDebateTime) || null;
    }

    const top = getCurrentPendingQuestion(stack);
    if (!top) return constraints;

    constraints.isDebatable = top.isDebatable && top.status === MOTION_STATUS.DEBATING;

    // Check if the top motion has debate limits from a Limit Debate motion (overrides org defaults)
    if (top.metadata?.debateLimits) {
        const limits = top.metadata.debateLimits;
        if (limits.maxSpeechDuration) constraints.maxSpeechDuration = limits.maxSpeechDuration;
        if (limits.maxSpeechesPerMember) constraints.maxSpeechesPerMember = limits.maxSpeechesPerMember;
        if (limits.totalTimeLimit) constraints.totalTimeLimit = limits.totalTimeLimit;
    }

    return constraints;
}

/**
 * Check if a specific member can still speak on the current question.
 * Per RONR, each member may speak twice on the same question per day,
 * and cannot speak a second time until all who wish to speak have spoken.
 */
export function canMemberSpeak(stack, userName, speakingHistory) {
    const top = getCurrentPendingQuestion(stack);
    if (!top) return { canSpeak: false, reason: 'No pending question' };
    if (!top.isDebatable) return { canSpeak: false, reason: 'This motion is not debatable' };
    if (top.status !== MOTION_STATUS.DEBATING) return { canSpeak: false, reason: 'Not in debate phase' };

    const constraints = getDebateConstraints(stack);

    // Count how many times this member has spoken on the current question
    const speechCount = (speakingHistory || []).filter(name => name === userName).length;

    if (speechCount >= constraints.maxSpeechesPerMember) {
        return {
            canSpeak: false,
            reason: `You have already spoken ${speechCount} times on this question (max ${constraints.maxSpeechesPerMember})`
        };
    }

    return { canSpeak: true, reason: null };
}

/**
 * Get a human-readable description of what's being debated
 */
export function getDebateDescription(stack) {
    const top = getCurrentPendingQuestion(stack);
    if (!top) return null;

    const rules = getRules(top.motionType);
    if (!rules) return null;

    return {
        motionType: rules.displayName,
        text: top.text,
        isDebatable: top.isDebatable,
        isAmendable: top.isAmendable,
        degree: top.degree
    };
}
