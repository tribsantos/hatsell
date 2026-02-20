import React, { useState, useEffect, useRef } from 'react';

export default function SpeakingTimer({ currentSpeaker, maxDurationMinutes, autoYield, onAutoYield, currentUser, onYield }) {
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
    const isSpeaker = currentUser && currentSpeaker.participant === currentUser.name;

    return (
        <div className={timerClass} role="timer" aria-live="polite">
            <div className="speaking-timer-left">
                <span className={`speaking-dot ${currentSpeaker.stance === 'pro' ? 'pro' : 'con'}`} />
                <div>
                    <div className="speaking-name">{currentSpeaker.participant}</div>
                    <div className={`speaking-stance ${currentSpeaker.stance === 'pro' ? 'pro' : 'con'}`}>
                        Speaking {currentSpeaker.stance === 'pro' ? 'in Favor' : 'Against'}
                    </div>
                </div>
            </div>
            <div className="speaking-timer-right">
                <div className="timer-display">
                    {remaining !== null ? formatTime(remaining) : formatTime(elapsed)}
                </div>
                {isSpeaker && onYield && (
                    <button onClick={onYield} className="ghost yield-btn">Yield</button>
                )}
            </div>
        </div>
    );
}
