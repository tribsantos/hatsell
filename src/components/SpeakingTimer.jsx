import React, { useState, useEffect, useRef } from 'react';

export default function SpeakingTimer({ currentSpeaker, maxDurationMinutes, autoYield, onAutoYield }) {
    const [elapsed, setElapsed] = useState(0);
    const hasAutoYielded = useRef(false);

    useEffect(() => {
        hasAutoYielded.current = false;
    }, [currentSpeaker?.speakingStartTime]);

    useEffect(() => {
        if (!currentSpeaker?.speakingStartTime) return;

        const update = () => {
            setElapsed(Math.floor((Date.now() - currentSpeaker.speakingStartTime) / 1000));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [currentSpeaker?.speakingStartTime]);

    useEffect(() => {
        if (!autoYield || !onAutoYield || !maxDurationMinutes || hasAutoYielded.current) return;
        const totalSeconds = maxDurationMinutes * 60;
        if (elapsed >= totalSeconds) {
            hasAutoYielded.current = true;
            onAutoYield();
        }
    }, [elapsed, autoYield, onAutoYield, maxDurationMinutes]);

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

    const timerClass = `speaking-timer${isOvertime ? ' expired' : totalSeconds && remaining <= 30 ? ' warning' : ''}`;

    return (
        <div className={timerClass} role="timer" aria-live="polite">
            <div className="timer-label">
                {currentSpeaker.participant} - {currentSpeaker.stance === 'pro' ? 'In Favor' : 'Against'}
            </div>

            {isOvertime && (
                <div className="timer-label" style={{ color: '#c0392b', fontWeight: 700 }}>
                    {autoYield ? 'Floor yielded - time expired' : "Time's up"}
                </div>
            )}

            <div className="timer-display">
                {remaining !== null ? formatTime(remaining) : formatTime(elapsed)}
            </div>

            {totalSeconds ? (
                <div className="timer-label" style={{ marginTop: '0.25rem' }}>
                    {isOvertime ? 'over time limit' : `of ${maxDurationMinutes} min`}
                </div>
            ) : (
                <div className="timer-label" style={{ marginTop: '0.25rem' }}>
                    elapsed (no time limit)
                </div>
            )}
        </div>
    );
}
