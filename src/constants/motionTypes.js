// Motion categories
export const MOTION_CATEGORY = {
    MAIN: 'main',
    SUBSIDIARY: 'subsidiary',
    PRIVILEGED: 'privileged',
    INCIDENTAL: 'incidental',
    BRING_BACK: 'bring_back'
};

// All motion type constants
export const MOTION_TYPES = {
    // Main motions
    MAIN: 'main',
    MAIN_INCIDENTAL: 'main_incidental',

    // Subsidiary motions (in order of precedence, lowest to highest)
    POSTPONE_INDEFINITELY: 'postpone_indefinitely',
    AMEND: 'amend',
    COMMIT: 'commit',
    POSTPONE_DEFINITELY: 'postpone_definitely',
    LIMIT_DEBATE: 'limit_debate',
    PREVIOUS_QUESTION: 'previous_question',
    LAY_ON_TABLE: 'lay_on_table',

    // Privileged motions (in order of precedence, continuing from subsidiary)
    ORDERS_OF_DAY: 'orders_of_day',
    QUESTION_OF_PRIVILEGE: 'question_of_privilege',
    RECESS: 'recess',
    ADJOURN: 'adjourn',
    FIX_TIME_TO_ADJOURN: 'fix_time_to_adjourn',

    // Incidental motions (no precedence among themselves)
    POINT_OF_ORDER: 'point_of_order',
    APPEAL: 'appeal',
    PARLIAMENTARY_INQUIRY: 'parliamentary_inquiry',
    REQUEST_FOR_INFO: 'request_for_info',
    DIVISION_OF_ASSEMBLY: 'division_of_assembly',
    SUSPEND_RULES: 'suspend_rules',
    WITHDRAW_MOTION: 'withdraw_motion',
    OBJECTION_TO_CONSIDERATION: 'objection_to_consideration',

    // Bring-back motions
    TAKE_FROM_TABLE: 'take_from_table',
    RECONSIDER: 'reconsider',
    RESCIND: 'rescind'
};

// Vote threshold types
export const VOTE_THRESHOLDS = {
    MAJORITY: 'majority',
    TWO_THIRDS: 'two_thirds',
    TIE_SUSTAINS: 'tie_sustains',
    NONE: 'none'
};

// Motion status values
export const MOTION_STATUS = {
    PENDING_SECOND: 'pending_second',
    DEBATING: 'debating',
    VOTING: 'voting',
    ADOPTED: 'adopted',
    DEFEATED: 'defeated',
    WITHDRAWN: 'withdrawn',
    TABLED: 'tabled',
    POSTPONED: 'postponed',
    COMMITTED: 'committed'
};

// Request status values (for incidental requests like parliamentary inquiry)
export const REQUEST_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    RESPONDED: 'responded',
    DISMISSED: 'dismissed'
};
