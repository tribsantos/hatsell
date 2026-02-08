import { VOTE_THRESHOLDS } from '../constants/motionTypes';

/**
 * Get a human-readable description of the vote threshold required
 */
export function describeThreshold(voteRequired) {
    switch (voteRequired) {
        case VOTE_THRESHOLDS.MAJORITY:
            return 'Majority vote required (more than half of votes cast)';
        case VOTE_THRESHOLDS.TWO_THIRDS:
            return 'Two-thirds vote required (at least 2/3 of votes cast)';
        case VOTE_THRESHOLDS.TIE_SUSTAINS:
            return 'Tie sustains the chair\'s ruling; majority required to overturn';
        case VOTE_THRESHOLDS.NONE:
            return 'No vote required (chair decides or demand)';
        default:
            return 'Majority vote required';
    }
}

/**
 * Get a short label for the threshold
 */
export function getThresholdLabel(voteRequired) {
    switch (voteRequired) {
        case VOTE_THRESHOLDS.MAJORITY:
            return 'Majority';
        case VOTE_THRESHOLDS.TWO_THIRDS:
            return '2/3 Vote';
        case VOTE_THRESHOLDS.TIE_SUSTAINS:
            return 'Tie Sustains Chair';
        case VOTE_THRESHOLDS.NONE:
            return 'No Vote';
        default:
            return 'Majority';
    }
}

/**
 * Handle a Division of the Assembly demand.
 * Resets votes for a recount by standing/show of hands.
 */
export function handleDivision(currentVotes) {
    return {
        votes: { aye: 0, nay: 0, abstain: 0 },
        votedBy: [],
        isDivision: true,
        message: 'Division demanded. The chair orders a re-vote by show of hands or standing.'
    };
}

/**
 * Calculate if enough members have voted (for UI guidance)
 */
export function getVotingProgress(votes, votedBy, totalParticipants) {
    const totalVoted = votedBy ? votedBy.length : 0;
    return {
        totalVoted,
        totalParticipants,
        allVoted: totalVoted >= totalParticipants,
        percentage: totalParticipants > 0 ? Math.round((totalVoted / totalParticipants) * 100) : 0
    };
}
