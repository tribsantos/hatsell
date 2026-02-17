/**
 * Audio cues using Web Audio API — no external files needed.
 * Each cue is a short synthesized tone pattern.
 */

let audioCtx = null;

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(frequency, duration, type = 'sine', volume = 0.15) {
    try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch {
        // Audio not available — silently ignore
    }
}

function playSequence(notes) {
    let offset = 0;
    for (const [freq, dur, type, vol] of notes) {
        setTimeout(() => playTone(freq, dur, type, vol), offset * 1000);
        offset += dur * 0.7; // slight overlap for smoother sequences
    }
}

/** Voting has opened — attention-getting double chime */
export function cueVotingOpened() {
    playSequence([
        [880, 0.15, 'sine', 0.12],
        [1100, 0.2, 'sine', 0.12]
    ]);
}

/** Motion seconded — quick confirmation pip */
export function cueMotionSeconded() {
    playTone(660, 0.12, 'sine', 0.1);
}

/** Speaking time expired — descending alert */
export function cueTimeExpired() {
    playSequence([
        [800, 0.15, 'triangle', 0.15],
        [600, 0.15, 'triangle', 0.15],
        [400, 0.25, 'triangle', 0.15]
    ]);
}

/** Vote result announced — resolving chord */
export function cueResultAnnounced() {
    playSequence([
        [523, 0.2, 'sine', 0.1],
        [659, 0.2, 'sine', 0.1],
        [784, 0.3, 'sine', 0.1]
    ]);
}

/** Meeting adjourned — final tone */
export function cueAdjourned() {
    playSequence([
        [784, 0.2, 'sine', 0.12],
        [659, 0.2, 'sine', 0.12],
        [523, 0.4, 'sine', 0.12]
    ]);
}

/** New motion introduced — single attention note */
export function cueNewMotion() {
    playTone(740, 0.18, 'sine', 0.1);
}
