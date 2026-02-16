import React, { useState, useEffect } from 'react';

export default function SpeakingTimer({ currentSpeaker, maxDurationMinutes }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!currentSpeaker?.speakingStartTime) return;

        const update = () => {
            setElapsed(Math.floor((Date.now() - currentSpeaker.speakingStartTime) / 1000));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [currentSpeaker?.speakingStartTime]);

    if (!currentSpeaker) return null;

    const totalSeconds = maxDurationMinutes ? maxDurationMinutes * 60 : null;
    const remaining = totalSeconds ? totalSeconds - elapsed : null;
    const isOvertime = remaining !== null && remaining <= 0;

    const formatTime = (secs) => {
        const negative = secs < 0;
        const abs = Math.abs(secs);
        const m = Math.floor(abs / 60);
        const s = abs % 60;
        return `${negative ? '-' : ''}${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            background: isOvertime ? 'rgba(192, 57, 43, 0.08)' : 'rgba(39, 174, 96, 0.08)',
            border: `2px solid ${isOvertime ? '#c0392b' : '#27ae60'}`,
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#666',
                marginBottom: '0.25rem'
            }}>
                {currentSpeaker.participant} — {currentSpeaker.stance === 'pro' ? 'In Favor' : 'Against'}
            </div>

            {isOvertime && (
                <div style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#c0392b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem',
                    animation: 'pulse 2s ease-in-out infinite'
                }}>
                    Time's up
                </div>
            )}

            <div style={{
                fontSize: '2rem',
                fontWeight: '900',
                fontFamily: "'Impact', 'Arial Black', monospace",
                letterSpacing: '0.05em',
                color: isOvertime ? '#c0392b' : '#1a1a1a'
            }}>
                {remaining !== null ? formatTime(remaining) : formatTime(elapsed)}
            </div>

            {totalSeconds ? (
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                    {isOvertime ? 'over time limit' : `of ${maxDurationMinutes} min`}
                </div>
            ) : (
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                    elapsed (no time limit)
                </div>
            )}
        </div>
    );
}
