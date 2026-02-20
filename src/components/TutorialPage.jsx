import React from 'react';
import HatsellLogo from './HatsellLogo';

export default function TutorialPage({ onBack, onOpenApp, onChair, onMember }) {
    const currentTab = 'general';

    return (
        <div className="tutorial-page">
            {/* Nav bar */}
            <header className="tutorial-nav">
                <div className="tutorial-nav-inner">
                    <button
                        className="tutorial-nav-brand"
                        onClick={onBack}
                        aria-label="Back to Hatsell"
                    >
                        <HatsellLogo small />
                        <span>Hatsell</span>
                    </button>
                    <nav className="tutorial-nav-tabs" aria-label="Tutorial sections">
                        <button className="tutorial-nav-tab active" onClick={() => {}}>
                            Overview
                        </button>
                        <button className="tutorial-nav-tab" onClick={onChair}>
                            For the Chair
                        </button>
                        <button className="tutorial-nav-tab" onClick={onMember}>
                            For Members
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <div className="tutorial-hero">
                <div className="tutorial-hero-inner">
                    <div className="tutorial-hero-logo">
                        <HatsellLogo />
                    </div>
                    <h1>Fair Meetings for Everyone</h1>
                    <p>
                        Parliamentary procedure exists to give every member an equal voice.
                        Hatsell makes it effortless.
                    </p>
                </div>
            </div>

            {/* Does this sound familiar? */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>Does this sound familiar?</h2>

                    <h3>"We already use Robert's Rules, but..."</h3>
                    <p>
                        Your organization adopted parliamentary procedure years ago. In theory, everyone has an
                        equal voice. In practice, it doesn't feel that way.
                    </p>
                    <p>
                        The chair fumbles through half-remembered scripts. A few confident members dominate the
                        floor while others sit in silence, unsure when they're allowed to speak or how to formally
                        disagree. Someone makes a motion, but nobody's quite sure if it needs a second, whether it
                        can be amended right now, or what vote threshold applies. The secretary scribbles notes and
                        hopes for the best.
                    </p>
                    <aside className="tutorial-callout">
                        You leave the meeting suspecting that decisions were made more by confusion than by
                        consensus.
                    </aside>

                    <h3>"We don't really have rules at all..."</h3>
                    <p>
                        Your group meets regularly &mdash; a board, a club, a committee, a community council. There's
                        an agenda, loosely followed. Whoever talks loudest or longest tends to win. Side
                        conversations derail the discussion. When a decision is finally reached, half the room
                        isn't sure what was actually decided.
                    </p>
                    <aside className="tutorial-callout">
                        You leave the meeting frustrated that an hour was spent and nothing clear was accomplished.
                    </aside>
                </div>
            </section>

            {/* What if the rules just ran themselves? */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>What if the rules just... ran themselves?</h2>
                    <p>
                        Parliamentary procedure exists to solve exactly these problems. It guarantees every member
                        an equal right to speak, to propose ideas, to disagree, and to vote. It ensures that
                        decisions are clear, recorded, and final.
                    </p>
                    <p>
                        The problem was never the rules. It was that the rules lived in a 700-page book, and
                        nobody had time to memorize them.
                    </p>
                    <aside className="tutorial-callout tutorial-callout-important">
                        <strong>Hatsell puts the rules in everyone's hands &mdash; automatically.</strong>
                    </aside>
                </div>
            </section>

            {/* How Hatsell works */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>How Hatsell works</h2>
                    <p>
                        Hatsell is a real-time web app that guides your meeting through proper parliamentary
                        procedure, step by step. The chair doesn't need to memorize scripts. Members don't need
                        to know the rules. The app tells everyone what they can do, when they can do it, and what
                        happens next.
                    </p>

                    <h3>One meeting, one code</h3>
                    <p>
                        The chair creates a meeting and gets a set of role codes &mdash; one for the chair, one for the
                        vice chair, one for the secretary, and one for members. Share the member code and everyone
                        joins from their own phone or laptop. No accounts, no sign-ups, no downloads.
                    </p>

                    <h3>The app guides the chair</h3>
                    <p>
                        At every stage of the meeting, Hatsell shows the chair exactly what to say and do. Call
                        the meeting to order. Conduct roll call. Ask for approval of minutes. Move through the
                        agenda. The chair follows the prompts &mdash; the procedure takes care of itself.
                    </p>

                    <h3>Every member sees their options</h3>
                    <p>
                        When it's time to act, members see clear buttons: make a motion, second a motion, request
                        to speak in favor or against, vote aye or nay. If an action isn't available right now &mdash;
                        because someone else has the floor, or because the motion needs a second first &mdash; the
                        button simply isn't there. No guessing, no interrupting, no awkward silence.
                    </p>

                    <h3>Fair, structured debate</h3>
                    <p>
                        Want to speak? Join the queue. Hatsell tracks who has spoken, how many times, and for how
                        long. The chair recognizes speakers in order. Both sides get heard. When debate is done,
                        the vote is called.
                    </p>

                    <h3>Clear decisions, on the record</h3>
                    <p>
                        Votes are counted instantly and displayed to everyone. The result is announced. The meeting
                        log captures every motion, every vote, every outcome. When the meeting ends, there's a
                        clear record of what happened and what was decided.
                    </p>
                </div>
            </section>

            {/* A meeting in five minutes */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>A meeting in five minutes</h2>
                    <p>Here's what a typical Hatsell meeting looks like:</p>

                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div>
                                <strong>Create and join.</strong> The chair creates a meeting, configures a few
                                settings (organization name, quorum, debate time limits), and shares the member code.
                                Everyone joins.
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div>
                                <strong>Call to order.</strong> The chair taps one button. The meeting begins.
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div>
                                <strong>Roll call.</strong> The secretary calls names. Members tap "Present" on
                                their screens. Quorum is confirmed automatically.
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">4</span>
                            <div>
                                <strong>Business.</strong> A member makes a motion: "I move that we allocate $500
                                for a community bulletin board." Another member seconds it. The chair opens debate. Two
                                people speak &mdash; one in favor, one against. The chair calls the vote. Members tap Aye
                                or Nay. The motion passes, 4 to 1.
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">5</span>
                            <div>
                                <strong>Adjourn.</strong> No further business. The chair adjourns the meeting. The
                                log shows everything that happened.
                            </div>
                        </li>
                    </ol>

                    <aside className="tutorial-callout tutorial-callout-tip">
                        <strong>Total time:</strong> as long as your business takes. No longer.
                    </aside>
                </div>
            </section>

            {/* What you don't need to know */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>What you don't need to know</h2>
                    <p>
                        You don't need to own a copy of Robert's Rules. You don't need to know what "subsidiary
                        motion" means. You don't need to memorize when a motion is debatable or what vote it requires.
                    </p>
                    <p>
                        Hatsell knows. It encodes the rules of parliamentary procedure so you can focus on what
                        actually matters: the ideas your group is discussing and the decisions you're making together.
                    </p>
                    <p>
                        If you want to go deeper &mdash; to understand why the rules work the way they do &mdash; Hatsell
                        won't stop you. But you'll never be blocked because you forgot a technicality.
                    </p>
                </div>
            </section>

            {/* Ready to dive in? */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>Ready to dive in?</h2>
                    <p>
                        Choose the guide that matches your role. Or just open Hatsell and follow the prompts &mdash;
                        that's what they're there for.
                    </p>
                    <div className="tutorial-cards">
                        <button className="tutorial-card" onClick={onChair}>
                            <h3>For the Chair</h3>
                            <p>
                                Creating a meeting, running each stage, managing debate, handling interruptions, and
                                adjourning.
                            </p>
                        </button>
                        <button className="tutorial-card" onClick={onMember}>
                            <h3>For Members</h3>
                            <p>
                                Joining, making motions, speaking in debate, voting, and using the tools available to
                                you.
                            </p>
                        </button>
                    </div>

                    <div className="tutorial-cta">
                        <button onClick={onOpenApp}>
                            Open Hatsell
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="tutorial-footer">
                <div className="tutorial-footer-inner">
                    <div className="tutorial-footer-links">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            Overview
                        </button>
                        <span className="separator">|</span>
                        <button onClick={onOpenApp}>
                            Open Hatsell
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
