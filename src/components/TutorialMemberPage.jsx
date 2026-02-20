import React from 'react';
import HatsellLogo from './HatsellLogo';

export default function TutorialMemberPage({ onBack, onOpenApp, onOverview, onChair }) {
    return (
        <div className="tutorial-page">
            {/* Nav bar */}
            <header className="tutorial-nav">
                <div className="tutorial-nav-inner">
                    <button className="tutorial-nav-brand" onClick={onBack} aria-label="Back to Hatsell">
                        <HatsellLogo small />
                        <span>Hatsell</span>
                    </button>
                    <nav className="tutorial-nav-tabs" aria-label="Tutorial sections">
                        <button className="tutorial-nav-tab" onClick={onOverview}>Overview</button>
                        <button className="tutorial-nav-tab" onClick={onChair}>For the Chair</button>
                        <button className="tutorial-nav-tab active">For Members</button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <div className="tutorial-hero">
                <div className="tutorial-hero-inner">
                    <div className="tutorial-hero-logo">
                        <HatsellLogo />
                    </div>
                    <h1>Hatsell for Members</h1>
                    <p>
                        You don't need to know parliamentary procedure &mdash; the app shows you exactly what
                        you can do at every moment.
                    </p>
                </div>
            </div>

            {/* Joining */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>Joining the meeting</h2>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div>Open Hatsell and enter your name.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div>Enter the meeting code you were given and tap <strong>Join Meeting</strong>.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div>You're in. You'll see the meeting screen with the current stage at the top.</div>
                        </li>
                    </ol>
                    <aside className="tutorial-callout tutorial-callout-tip">
                        That's it. No account, no sign-up. The code determines your role &mdash; if you were
                        given the Member code, you join as a member. If you were given the Secretary or Vice
                        Chair code, you join with that role automatically.
                    </aside>
                </div>
            </section>

            {/* The meeting flow */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>The meeting flow</h2>
                    <p>
                        The chair runs the meeting through a series of stages. You don't need to memorize
                        them &mdash; just watch your screen for what's available to you.
                    </p>

                    <h3>Roll call</h3>
                    <p>
                        The secretary (or chair) will call your name. When you see the prompt,
                        tap <strong>Present</strong>. This confirms your attendance. The meeting can't proceed
                        until enough members are present (that's called quorum).
                    </p>

                    <h3>Approving minutes</h3>
                    <p>
                        If there are minutes from a previous meeting, the chair will ask for approval. You have two options:
                    </p>
                    <ul className="tutorial-tip-list">
                        <li>If the minutes look correct, do nothing &mdash; they'll be approved by general consent.</li>
                        <li>If something needs correcting, tap <strong>Submit Correction</strong> and describe what should change.</li>
                    </ul>
                </div>
            </section>

            {/* Business */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>Business &mdash; this is where you matter most</h2>
                    <p>This is the heart of the meeting: proposals, debate, and decisions.</p>

                    <h3>Making a motion</h3>
                    <p>
                        If you have a proposal &mdash; something you want the group to decide on &mdash;
                        tap <strong>Make a Motion</strong>. Type what you're proposing in plain language
                        (e.g., "Allocate $500 for a community bulletin board"). Submit it.
                    </p>
                    <p>
                        The chair will recognize your motion and bring it to the floor. Then it needs
                        a <strong>second</strong> from another member before debate can begin.
                    </p>

                    <h3>Seconding a motion</h3>
                    <p>
                        When someone else makes a motion, you'll see a <strong>Second</strong> button.
                        Tapping it means "I think this is worth discussing" &mdash; it doesn't mean you
                        agree. A motion needs at least one second to move forward.
                    </p>

                    <h3>Speaking in debate</h3>
                    <p>
                        Once a motion is on the floor and open for debate, you can request to speak.
                        You'll choose a stance:
                    </p>
                    <div className="tutorial-stance-cards">
                        <div className="tutorial-stance-card tutorial-stance-favor">
                            <p className="tutorial-stance-title">Speak in Favor</p>
                            <p className="tutorial-stance-desc">You support the motion</p>
                        </div>
                        <div className="tutorial-stance-card tutorial-stance-against">
                            <p className="tutorial-stance-title">Speak Against</p>
                            <p className="tutorial-stance-desc">You oppose it</p>
                        </div>
                    </div>
                    <p>
                        You're added to the speaking queue. The chair recognizes speakers in order. When it's
                        your turn, a timer starts &mdash; speak your piece within the time limit. When you're
                        done, tap <strong>Yield the Floor</strong> (or the timer will run out).
                    </p>

                    <h3>Voting</h3>
                    <p>When debate is over, the chair calls the vote. Three buttons appear:</p>
                    <div className="tutorial-vote-preview">
                        <span className="tutorial-vote-btn aye">Aye</span>
                        <span className="tutorial-vote-btn nay">Nay</span>
                        <span className="tutorial-vote-btn abstain">Abstain</span>
                    </div>
                    <p>
                        Tap once. Your vote is recorded. When everyone has voted (or the chair closes the vote),
                        the result is announced.
                    </p>
                </div>
            </section>

            {/* Other things you can do */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>Other things you can do</h2>
                    <p>
                        During business, you may have more options depending on what's happening. You don't
                        need to memorize any of this:
                    </p>
                    <aside className="tutorial-callout tutorial-callout-important">
                        If an action is available, you'll see a button for it. If it's not available right
                        now, the button won't be there.
                    </aside>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">Amend a motion</td><td>You want to change the wording of the motion on the floor. Tap Amend, type your proposed change. It gets debated and voted on separately before the group returns to the original motion.</td></tr>
                                <tr><td className="ref-label">Point of order</td><td>You think the rules are being broken (someone is speaking out of turn, the motion isn't in order, etc.). Tap Point of Order and describe your concern. The chair must stop and rule on it immediately.</td></tr>
                                <tr><td className="ref-label">Parliamentary inquiry</td><td>You have a question about procedure ("Can we amend this motion?" or "How many votes does this need?"). The chair will answer.</td></tr>
                                <tr><td className="ref-label">Request for information</td><td>You need a factual clarification before you can vote ("What's our current budget balance?").</td></tr>
                                <tr><td className="ref-label">Appeal</td><td>You disagree with the chair's ruling on a point of order. An appeal puts the question to the whole group &mdash; majority rules.</td></tr>
                                <tr><td className="ref-label">Move to adjourn</td><td>You think the meeting should end. This gets voted on.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* What you'll see on screen */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>What you'll see on screen</h2>
                    <div className="tutorial-screen-cards">
                        <div className="tutorial-screen-card">
                            <h3>The meeting stage</h3>
                            <p>The large heading at the top tells you where the meeting is (Roll Call, New Business, Voting, etc.).</p>
                        </div>
                        <div className="tutorial-screen-card">
                            <h3>The current motion</h3>
                            <p>When a motion is on the floor, you'll see its text, who moved it, who seconded it, and its current status (debating, voting, etc.).</p>
                        </div>
                        <div className="tutorial-screen-card tutorial-screen-card-highlight">
                            <h3>Your action buttons</h3>
                            <p>These change based on what's happening. They're the only things you need to pay attention to. If there's something for you to do, there's a button for it.</p>
                        </div>
                        <div className="tutorial-screen-card">
                            <h3>The top bar</h3>
                            <p>Has buttons to open the participant list, speaking queue, and meeting log. Use these if you want to see who's in the meeting, where you are in the queue, or what's happened so far.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>Tips</h2>
                    <ul className="tutorial-tip-list">
                        <li><strong>You can't break anything.</strong> The app only lets you do things that are in order. You can't accidentally speak out of turn or make an invalid motion.</li>
                        <li><strong>You don't need to raise your hand.</strong> Tap the button. The queue handles it.</li>
                        <li><strong>Seconding isn't agreeing.</strong> It just means "let's discuss this." You can second a motion and then vote against it.</li>
                        <li><strong>If you're not sure, wait and watch.</strong> The first few minutes will make the rhythm clear. Most of the meeting is: someone proposes, people discuss, everyone votes.</li>
                        <li><strong>Check the log</strong> if you missed something. It's in the top bar.</li>
                        <li><strong>Your vote counts equally.</strong> That's the whole point.</li>
                    </ul>
                </div>
            </section>

            {/* Footer */}
            <footer className="tutorial-footer">
                <div className="tutorial-footer-inner">
                    <div className="tutorial-cta">
                        <button onClick={onOpenApp}>Open Hatsell</button>
                    </div>
                    <div className="tutorial-footer-links" style={{ marginTop: '1rem' }}>
                        <button onClick={onOverview}>Overview</button>
                        <span className="separator">|</span>
                        <button onClick={onChair}>Chair Guide</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
