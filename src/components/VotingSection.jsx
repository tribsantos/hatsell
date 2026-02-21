import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ROLES } from '../constants';
import { describeThreshold, getThresholdLabel } from '../engine/voteEngine';

export default function VotingSection({ votes, isChair, onVote, onAnnounceResult, currentUser, votedBy, motionStack, onDivision, voteStartTime, participants }) {
    const { t } = useTranslation('meeting');
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
    const abstain = votes.abstain || 0;
    const totalCast = aye + nay;
    const totalAll = aye + nay + abstain;

    const computeMajorityAchieved = () => {
        if (totalCast === 0) return false;
        if (voteRequired === 'two_thirds') {
            return aye >= (totalCast * 2) / 3 || nay > totalCast / 3;
        }
        return aye > totalCast / 2 || nay >= totalCast / 2;
    };

    const majorityAchieved = computeMajorityAchieved();

    // Compute preliminary result for chair (require at least 2 votes cast to show)
    const getPreliminaryResult = () => {
        if (totalCast < 2) return null;
        if (voteRequired === 'two_thirds') {
            return aye >= (totalCast * 2) / 3 ? 'passes' : 'fails';
        }
        if (voteRequired === 'tie_sustains') {
            // Appeal: aye > nay overturns; tie or nay majority sustains chair
            return aye > nay ? 'passes' : 'fails';
        }
        return aye > totalCast / 2 ? 'passes' : 'fails';
    };
    const preliminaryResult = getPreliminaryResult();
    const isAppeal = voteRequired === 'tie_sustains';

    const totalParticipants = (participants || []).length;
    const chairNotVoted = isChair && !hasVoted;
    const allVoted = totalParticipants > 0 && (totalVoted >= totalParticipants || (chairNotVoted && totalVoted >= totalParticipants - 1));

    let announceDisabled = false;
    let announceReason = '';
    if (voteStartTime) {
        if (allVoted) {
            announceDisabled = false;
            announceReason = chairNotVoted ? t('vote_all_voted_chair') : t('vote_all_voted');
        } else if (elapsedSeconds < 30) {
            announceDisabled = true;
            announceReason = t('vote_open_countdown', { seconds: 30 - elapsedSeconds });
        } else if (elapsedSeconds < 60) {
            if (strictMemberCount > 10 && majorityAchieved) {
                announceDisabled = false;
                announceReason = t('vote_threshold_achieved');
            } else {
                announceDisabled = true;
                announceReason = strictMemberCount > 10
                    ? t('vote_waiting_threshold', { seconds: 60 - elapsedSeconds })
                    : t('vote_waiting_votes', { seconds: 60 - elapsedSeconds });
            }
        } else {
            announceDisabled = false;
            announceReason = t('vote_period_complete');
        }
    }

    // Tally bar segment widths
    const barAye = totalAll > 0 ? (aye / totalAll) * 100 : 0;
    const barNay = totalAll > 0 ? (nay / totalAll) * 100 : 0;
    const barAbstain = totalAll > 0 ? (abstain / totalAll) * 100 : 0;

    return (
        <div className="vote-section" aria-live="polite">
            <h3>{t('vote_cast_title')}</h3>

            {top && (
                <div className="info-box" style={{ marginBottom: '1rem' }}>
                    <div style={{ color: '#e67e22', fontWeight: 600 }}>
                        {top.displayName}: "{top.text}"
                    </div>
                    {top.metadata?.amendmentHistory && top.metadata.amendmentHistory.length > 0 && (
                        <div style={{ color: '#888', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                            <div>{t('vote_original', { text: top.metadata.originalText })}</div>
                            {top.metadata.amendmentHistory.map((ah, i) => (
                                <div key={i}>{t('vote_amendment_num', { num: i + 1, text: ah.amendmentText })}</div>
                            ))}
                        </div>
                    )}
                    <div style={{ color: '#666', marginTop: '0.25rem' }}>{thresholdDesc}</div>
                </div>
            )}

            {!hasVoted ? (
                <div className="vote-buttons">
                    <button className="aye" onClick={() => onVote('aye')}>{t('vote_aye')}</button>
                    <button className="nay" onClick={() => onVote('nay')}>{t('vote_nay')}</button>
                    <button className="abstain" onClick={() => onVote('abstain')}>{t('vote_abstain')}</button>
                </div>
            ) : (
                <div className="vote-confirmed">
                    <span className="check-icon">{'\u2713'}</span>
                    {t('vote_recorded')}
                </div>
            )}

            {/* Vote tally visible to all participants */}
            {totalAll > 0 && (
                <div className="vote-tally-bar" role="img" aria-label={t('vote_tally_aria', { aye, nay, abstain })}>
                    {barAye > 0 && <div className="bar-segment bar-aye" style={{ width: `${barAye}%` }} />}
                    {barNay > 0 && <div className="bar-segment bar-nay" style={{ width: `${barNay}%` }} />}
                    {barAbstain > 0 && <div className="bar-segment bar-abstain" style={{ width: `${barAbstain}%` }} />}
                </div>
            )}

            <div className="vote-tally">
                <div className="vote-count">
                    <div className="number">{votes.aye}</div>
                    <div className="label">{t('vote_ayes')}</div>
                </div>
                <div className="vote-count">
                    <div className="number">{votes.nay}</div>
                    <div className="label">{t('vote_nays')}</div>
                </div>
                <div className="vote-count">
                    <div className="number">{votes.abstain}</div>
                    <div className="label">{t('vote_abstentions')}</div>
                </div>
            </div>

            <div className="vote-threshold">
                {t('vote_threshold', { threshold: thresholdLabel })}
            </div>

            {isChair ? (
                <>
                    {/* Preliminary result badge — chair only */}
                    {preliminaryResult && (
                        <div style={{ textAlign: 'center' }}>
                            <span className={`vote-preliminary ${preliminaryResult}`}>
                                {isAppeal
                                    ? (preliminaryResult === 'passes' ? t('vote_preliminary_appeal_sustained') : t('vote_preliminary_appeal_denied'))
                                    : (preliminaryResult === 'passes' ? t('vote_preliminary_passes') : t('vote_preliminary_fails'))
                                }
                            </span>
                        </div>
                    )}

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
                            {t('vote_announce_result')}
                        </button>
                        {onDivision && (
                            <button onClick={onDivision} className="secondary" style={{ flex: 1 }}>
                                {t('vote_division')}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                    {t('vote_threshold_required', { threshold: thresholdLabel })}
                </div>
            )}
        </div>
    );
}
