import React from 'react';
import { describeThreshold, getThresholdLabel } from '../engine/voteEngine';

export default function VotingSection({ votes, isChair, onVote, onAnnounceResult, currentUser, votedBy, motionStack, onDivision }) {
    const hasVoted = votedBy && votedBy.includes(currentUser.name);
    const totalVoted = votedBy ? votedBy.length : 0;

    const top = motionStack && motionStack.length > 0 ? motionStack[motionStack.length - 1] : null;
    const voteRequired = top?.voteRequired || 'majority';
    const thresholdLabel = getThresholdLabel(voteRequired);
    const thresholdDesc = describeThreshold(voteRequired);

    return (
        <div className="vote-section">
            <h3>Cast Your Vote</h3>

            {top && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(230, 126, 34, 0.08)',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                }}>
                    <div style={{ color: '#e67e22', fontWeight: '600' }}>
                        {top.displayName}: "{top.text}"
                    </div>
                    <div style={{ color: '#666', marginTop: '0.25rem' }}>
                        {thresholdDesc}
                    </div>
                </div>
            )}

            {!hasVoted ? (
                <div className="vote-buttons">
                    <button className="aye" onClick={() => onVote('aye')}>
                        Aye
                    </button>
                    <button className="nay" onClick={() => onVote('nay')}>
                        Nay
                    </button>
                    <button className="secondary" onClick={() => onVote('abstain')}>
                        Abstain
                    </button>
                </div>
            ) : (
                <div className="info-box">
                    Your vote has been recorded.
                </div>
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

                    <div style={{
                        textAlign: 'center', marginTop: '0.5rem',
                        fontSize: '0.8rem', color: '#666'
                    }}>
                        Threshold: {thresholdLabel} | Abstentions do not count as votes cast
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button onClick={onAnnounceResult} style={{ flex: 2 }}>
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
                <div style={{marginTop: '2rem', textAlign: 'center', color: '#666'}}>
                    <p>Votes cast: {totalVoted}</p>
                    <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
                        {thresholdLabel} required. Results will be announced by the chair.
                    </p>
                </div>
            )}
        </div>
    );
}
