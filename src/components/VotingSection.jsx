import React, { useState, useEffect, useRef } from 'react';
import { ROLES } from '../constants';
import { describeThreshold, getThresholdLabel } from '../engine/voteEngine';

export default function VotingSection({ votes, isChair, onVote, onAnnounceResult, currentUser, votedBy, motionStack, onDivision, voteStartTime, participants }) {
    const hasVoted = votedBy && votedBy.includes(currentUser.name);
    const totalVoted = votedBy ? votedBy.length : 0;

    const top = motionStack && motionStack.length > 0 ? motionStack[motionStack.length - 1] : null;
    const voteRequired = top?.voteRequired || 'majority';
    const thresholdLabel = getThresholdLabel(voteRequired);
    const thresholdDesc = describeThreshold(voteRequired);

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const trackedStartTime = useRef(null);

    useEffect(() => {
        if (!voteStartTime) {
            trackedStartTime.current = null;
            setElapsedSeconds(0);
            return;
        }
        if (trackedStartTime.current === voteStartTime) return;
        trackedStartTime.current = voteStartTime;

        const update = () => setElapsedSeconds(Math.floor((Date.now() - trackedStartTime.current) / 1000));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [!!voteStartTime]);

    const strictMemberCount = (participants || []).filter((p) => p.role === ROLES.MEMBER).length;
    const aye = votes.aye || 0;
    const nay = votes.nay || 0;
    const totalCast = aye + nay;

    const computeMajorityAchieved = () => {
        if (totalCast === 0) return false;
        if (voteRequired === 'two_thirds') {
            return aye >= (totalCast * 2) / 3 || nay > totalCast / 3;
        }
        return aye > totalCast / 2 || nay >= totalCast / 2;
    };

    const majorityAchieved = computeMajorityAchieved();

    const totalParticipants = (participants || []).length;
    const allVoted = totalParticipants > 0 && totalVoted >= totalParticipants;

    let announceDisabled = false;
    let announceReason = '';
    if (voteStartTime) {
        if (allVoted) {
            announceDisabled = false;
            announceReason = 'All participants have voted';
        } else if (elapsedSeconds < 30) {
            announceDisabled = true;
            announceReason = `Voting open (${30 - elapsedSeconds}s until early close)`;
        } else if (elapsedSeconds < 60) {
            if (strictMemberCount > 10 && majorityAchieved) {
                announceDisabled = false;
                announceReason = 'Threshold achieved - may announce';
            } else {
                announceDisabled = true;
                announceReason = strictMemberCount > 10
                    ? `Waiting for threshold (${60 - elapsedSeconds}s until auto-close)`
                    : `Waiting for votes (${60 - elapsedSeconds}s until auto-close)`;
            }
        } else {
            announceDisabled = false;
            announceReason = 'Voting period complete - non-voters counted as abstentions';
        }
    }

    return (
        <div className="vote-section" aria-live="polite">
            <h3>Cast Your Vote</h3>

            {top && (
                <div className="info-box" style={{ marginBottom: '1rem' }}>
                    <div style={{ color: '#e67e22', fontWeight: 600 }}>
                        {top.displayName}: "{top.text}"
                    </div>
                    {top.metadata?.amendmentHistory && top.metadata.amendmentHistory.length > 0 && (
                        <div style={{ color: '#888', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                            <div>Original: "{top.metadata.originalText}"</div>
                            {top.metadata.amendmentHistory.map((ah, i) => (
                                <div key={i}>Amendment {i + 1}: "{ah.amendmentText}"</div>
                            ))}
                        </div>
                    )}
                    <div style={{ color: '#666', marginTop: '0.25rem' }}>{thresholdDesc}</div>
                </div>
            )}

            {!hasVoted ? (
                <div className="vote-buttons">
                    <button className="aye" onClick={() => onVote('aye')}>Aye</button>
                    <button className="nay" onClick={() => onVote('nay')}>Nay</button>
                    <button className="abstain" onClick={() => onVote('abstain')}>Abstain</button>
                </div>
            ) : (
                <div className="info-box">Your vote has been recorded.</div>
            )}

            {isChair ? (
                <>
                    <div className="vote-tally">
                        <div className="vote-count">
                            <div className="number">{votes.aye}</div>
                            <div className="label">Ayes</div>
                        </div>
                        <div className="vote-count">
                            <div className="number">{votes.nay}</div>
                            <div className="label">Nays</div>
                        </div>
                        <div className="vote-count">
                            <div className="number">{votes.abstain}</div>
                            <div className="label">Abstentions</div>
                        </div>
                    </div>

                    <div className="vote-threshold">
                        Threshold: {thresholdLabel} | Abstentions do not count as votes cast
                    </div>

                    {announceReason && (
                        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: announceDisabled ? '#e67e22' : '#27ae60', fontWeight: 600 }}>
                            {announceReason}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button
                            onClick={!announceDisabled ? onAnnounceResult : undefined}
                            disabled={announceDisabled}
                            style={{ flex: 2, ...(announceDisabled ? { opacity: 0.45 } : {}) }}
                        >
                            Announce Result
                        </button>
                        {onDivision && (
                            <button onClick={onDivision} className="secondary" style={{ flex: 1 }}>
                                Division
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
                    <p>Votes cast: {totalVoted}</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {thresholdLabel} required. Results will be announced by the chair.
                    </p>
                </div>
            )}
        </div>
    );
}
