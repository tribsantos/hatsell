import { MOTION_TYPES, MOTION_CATEGORY, VOTE_THRESHOLDS } from '../constants/motionTypes';

/**
 * Master rules database for all motion types per RONR.
 * Each entry defines the parliamentary characteristics of that motion type.
 */
export const MOTION_RULES = {
    // === MAIN MOTIONS ===
    [MOTION_TYPES.MAIN]: {
        category: MOTION_CATEGORY.MAIN,
        displayName: 'Main Motion',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 0,
        appliesTo: [],
        subjectTo: [
            MOTION_TYPES.POSTPONE_INDEFINITELY, MOTION_TYPES.AMEND,
            MOTION_TYPES.COMMIT, MOTION_TYPES.POSTPONE_DEFINITELY,
            MOTION_TYPES.LIMIT_DEBATE, MOTION_TYPES.PREVIOUS_QUESTION,
            MOTION_TYPES.LAY_ON_TABLE
        ]
    },
    [MOTION_TYPES.MAIN_INCIDENTAL]: {
        category: MOTION_CATEGORY.MAIN,
        displayName: 'Incidental Main Motion',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 0,
        appliesTo: [],
        subjectTo: [
            MOTION_TYPES.POSTPONE_INDEFINITELY, MOTION_TYPES.AMEND,
            MOTION_TYPES.COMMIT, MOTION_TYPES.POSTPONE_DEFINITELY,
            MOTION_TYPES.LIMIT_DEBATE, MOTION_TYPES.PREVIOUS_QUESTION,
            MOTION_TYPES.LAY_ON_TABLE
        ]
    },

    // === SUBSIDIARY MOTIONS (precedence 1-7) ===
    [MOTION_TYPES.POSTPONE_INDEFINITELY]: {
        category: MOTION_CATEGORY.SUBSIDIARY,
        displayName: 'Postpone Indefinitely',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 1,
        appliesTo: [MOTION_TYPES.MAIN, MOTION_TYPES.MAIN_INCIDENTAL],
        subjectTo: [
            MOTION_TYPES.LIMIT_DEBATE, MOTION_TYPES.PREVIOUS_QUESTION
        ]
    },
    [MOTION_TYPES.AMEND]: {
        category: MOTION_CATEGORY.SUBSIDIARY,
        displayName: 'Amend',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: true,  // amendment to the amendment (degree 2 max)
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 2,
        appliesTo: [MOTION_TYPES.MAIN, MOTION_TYPES.MAIN_INCIDENTAL, MOTION_TYPES.AMEND],
        subjectTo: [
            MOTION_TYPES.LIMIT_DEBATE, MOTION_TYPES.PREVIOUS_QUESTION
        ],
        maxDegree: 2  // primary amendment = degree 1, secondary = degree 2
    },
    [MOTION_TYPES.COMMIT]: {
        category: MOTION_CATEGORY.SUBSIDIARY,
        displayName: 'Refer to Committee',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 3,
        appliesTo: [MOTION_TYPES.MAIN, MOTION_TYPES.MAIN_INCIDENTAL],
        subjectTo: [
            MOTION_TYPES.AMEND, MOTION_TYPES.LIMIT_DEBATE,
            MOTION_TYPES.PREVIOUS_QUESTION
        ]
    },
    [MOTION_TYPES.POSTPONE_DEFINITELY]: {
        category: MOTION_CATEGORY.SUBSIDIARY,
        displayName: 'Postpone to a Definite Time',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 4,
        appliesTo: [MOTION_TYPES.MAIN, MOTION_TYPES.MAIN_INCIDENTAL],
        subjectTo: [
            MOTION_TYPES.AMEND, MOTION_TYPES.LIMIT_DEBATE,
            MOTION_TYPES.PREVIOUS_QUESTION
        ]
    },
    [MOTION_TYPES.LIMIT_DEBATE]: {
        category: MOTION_CATEGORY.SUBSIDIARY,
        displayName: 'Limit/Extend Debate',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.TWO_THIRDS,
        canInterrupt: false,
        precedence: 5,
        appliesTo: [
            MOTION_TYPES.MAIN, MOTION_TYPES.MAIN_INCIDENTAL,
            MOTION_TYPES.AMEND, MOTION_TYPES.COMMIT,
            MOTION_TYPES.POSTPONE_DEFINITELY, MOTION_TYPES.POSTPONE_INDEFINITELY
        ],
        subjectTo: [MOTION_TYPES.PREVIOUS_QUESTION]
    },
    [MOTION_TYPES.PREVIOUS_QUESTION]: {
        category: MOTION_CATEGORY.SUBSIDIARY,
        displayName: 'Previous Question (Close Debate)',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.TWO_THIRDS,
        canInterrupt: false,
        precedence: 6,
        appliesTo: [
            MOTION_TYPES.MAIN, MOTION_TYPES.MAIN_INCIDENTAL,
            MOTION_TYPES.AMEND, MOTION_TYPES.COMMIT,
            MOTION_TYPES.POSTPONE_DEFINITELY, MOTION_TYPES.POSTPONE_INDEFINITELY,
            MOTION_TYPES.LIMIT_DEBATE
        ],
        subjectTo: []
    },
    [MOTION_TYPES.LAY_ON_TABLE]: {
        category: MOTION_CATEGORY.SUBSIDIARY,
        displayName: 'Lay on the Table',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 7,
        appliesTo: [MOTION_TYPES.MAIN, MOTION_TYPES.MAIN_INCIDENTAL],
        subjectTo: []
    },

    // === PRIVILEGED MOTIONS (precedence 8-12) ===
    [MOTION_TYPES.ORDERS_OF_DAY]: {
        category: MOTION_CATEGORY.PRIVILEGED,
        displayName: 'Call for Orders of the Day',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.NONE,  // demand, no vote unless objection
        canInterrupt: true,
        precedence: 8,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.QUESTION_OF_PRIVILEGE]: {
        category: MOTION_CATEGORY.PRIVILEGED,
        displayName: 'Question of Privilege',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.NONE,  // chair rules
        canInterrupt: true,
        precedence: 9,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.RECESS]: {
        category: MOTION_CATEGORY.PRIVILEGED,
        displayName: 'Recess',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 10,
        appliesTo: [],
        subjectTo: [MOTION_TYPES.AMEND]
    },
    [MOTION_TYPES.ADJOURN]: {
        category: MOTION_CATEGORY.PRIVILEGED,
        displayName: 'Adjourn',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 11,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.FIX_TIME_TO_ADJOURN]: {
        category: MOTION_CATEGORY.PRIVILEGED,
        displayName: 'Fix the Time to Which to Adjourn',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 12,
        appliesTo: [],
        subjectTo: [MOTION_TYPES.AMEND]
    },

    // === INCIDENTAL MOTIONS (no relative precedence) ===
    [MOTION_TYPES.POINT_OF_ORDER]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Point of Order',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.NONE,  // chair rules
        canInterrupt: true,
        precedence: null,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.APPEAL]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Appeal the Decision of the Chair',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.TIE_SUSTAINS,  // tie sustains chair
        canInterrupt: true,
        precedence: null,
        appliesTo: [],
        subjectTo: [MOTION_TYPES.PREVIOUS_QUESTION]
    },
    [MOTION_TYPES.PARLIAMENTARY_INQUIRY]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Parliamentary Inquiry',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.NONE,
        canInterrupt: true,
        precedence: null,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.REQUEST_FOR_INFO]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Request for Information',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.NONE,
        canInterrupt: true,
        precedence: null,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.DIVISION_OF_ASSEMBLY]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Division of the Assembly',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.NONE,  // demand
        canInterrupt: true,
        precedence: null,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.SUSPEND_RULES]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Suspend the Rules',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.TWO_THIRDS,
        canInterrupt: false,
        precedence: null,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.WITHDRAW_MOTION]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Withdraw a Motion',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.NONE,  // consent or majority if objected
        canInterrupt: false,
        precedence: null,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.OBJECTION_TO_CONSIDERATION]: {
        category: MOTION_CATEGORY.INCIDENTAL,
        displayName: 'Objection to Consideration',
        requiresSecond: false,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.TWO_THIRDS,  // 2/3 against to sustain objection
        canInterrupt: true,
        precedence: null,
        appliesTo: [MOTION_TYPES.MAIN],
        subjectTo: []
    },

    // === BRING-BACK MOTIONS ===
    [MOTION_TYPES.TAKE_FROM_TABLE]: {
        category: MOTION_CATEGORY.BRING_BACK,
        displayName: 'Take from the Table',
        requiresSecond: true,
        isDebatable: false,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: false,
        precedence: 0,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.RECONSIDER]: {
        category: MOTION_CATEGORY.BRING_BACK,
        displayName: 'Reconsider',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: false,
        voteRequired: VOTE_THRESHOLDS.MAJORITY,
        canInterrupt: true,
        precedence: null,
        appliesTo: [],
        subjectTo: []
    },
    [MOTION_TYPES.RESCIND]: {
        category: MOTION_CATEGORY.BRING_BACK,
        displayName: 'Rescind/Amend Something Previously Adopted',
        requiresSecond: true,
        isDebatable: true,
        isAmendable: true,
        voteRequired: VOTE_THRESHOLDS.TWO_THIRDS,  // or majority with previous notice
        canInterrupt: false,
        precedence: 0,
        appliesTo: [],
        subjectTo: [
            MOTION_TYPES.AMEND, MOTION_TYPES.PREVIOUS_QUESTION,
            MOTION_TYPES.LIMIT_DEBATE
        ]
    }
};

/**
 * Get the rules for a given motion type
 */
export function getRules(motionType) {
    return MOTION_RULES[motionType] || null;
}

/**
 * Get display name for a motion type
 */
export function getDisplayName(motionType) {
    const rules = MOTION_RULES[motionType];
    return rules ? rules.displayName : motionType;
}

/**
 * Check if a motion type exists in the rules database
 */
export function isValidMotionType(motionType) {
    return motionType in MOTION_RULES;
}
