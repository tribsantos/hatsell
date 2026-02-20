import React from 'react';
import HatsellLogo from './HatsellLogo';

export default function TutorialChairPage({ onBack, onOpenApp, onOverview, onMember }) {
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
                        <button className="tutorial-nav-tab active">For the Chair</button>
                        <button className="tutorial-nav-tab" onClick={onMember}>For Members</button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <div className="tutorial-hero">
                <div className="tutorial-hero-inner">
                    <div className="tutorial-hero-logo">
                        <HatsellLogo />
                    </div>
                    <h1>Hatsell for the Chair</h1>
                    <p>
                        You're running the meeting. That might sound intimidating &mdash; but Hatsell does the
                        heavy lifting. You just follow the prompts.
                    </p>
                </div>
            </div>

            {/* Part 1: Before the meeting */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>Part 1: Before the meeting</h2>

                    <h3>Create the meeting</h3>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div>Open Hatsell and enter your name.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div>Tap <strong>Create a New Meeting</strong>.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div>
                                You'll land on the General Settings screen. Fill in what you know &mdash;
                                everything has sensible defaults.
                            </div>
                        </li>
                    </ol>

                    <h3>Organization Profile</h3>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">Organization name</td><td>Shows in the top bar during the meeting (e.g., "Maplewood Neighborhood Association").</td></tr>
                                <tr><td className="ref-label">Total membership</td><td>Used to calculate quorum. Leave blank if you're not sure.</td></tr>
                                <tr><td className="ref-label">Quorum</td><td>The minimum number of members needed to do business. The default (majority of membership) follows Robert's Rules. You can set a fixed number or fraction if your bylaws say something different.</td></tr>
                                <tr><td className="ref-label">Voting basis</td><td>How votes are counted. The default ("votes cast") is correct for most organizations. Only change this if your bylaws specify otherwise.</td></tr>
                                <tr><td className="ref-label">Debate limits</td><td>How long each person can speak (default: 10 minutes) and how many times (default: 2). You can also set a total debate time limit per motion.</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Settings for this meeting</h3>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">Meeting name</td><td>"Regular Meeting," "Annual Meeting," etc.</td></tr>
                                <tr><td className="ref-label">Agenda</td><td>Optionally add agenda items. You can use them as guidance (a reference for yourself) or as adopted Orders of the Day (binding).</td></tr>
                                <tr><td className="ref-label">Previous notice</td><td>Check any items that members were notified about in advance. This affects what vote thresholds apply.</td></tr>
                                <tr><td className="ref-label">Meeting type</td><td>Regular or special. Special meetings can only discuss business specified in the call.</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <aside className="tutorial-callout tutorial-callout-tip">
                        Don't overthink the settings. The defaults work for a standard meeting. You can always come back and adjust for next time.
                    </aside>

                    <h3>Share the codes</h3>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">4</span>
                            <div>Tap <strong>Confirm</strong>. Hatsell generates a unique code for each role: Chair, Vice Chair, Secretary, and Member.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">5</span>
                            <div>Share the appropriate code with each person. The <strong>Member</strong> code is the one most people need. You can tap <strong>Copy All Codes</strong> to paste them into a group chat or email.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">6</span>
                            <div>Tap <strong>Start Meeting</strong> when you're ready.</div>
                        </li>
                    </ol>
                </div>
            </section>

            {/* Part 2: Running the meeting */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>Part 2: Running the meeting</h2>
                    <p>Once the meeting starts, you'll see three things that will be your constant companions:</p>

                    <div className="tutorial-companion-list">
                        <div className="tutorial-companion" style={{ borderLeftColor: 'var(--h-red)' }}>
                            <p className="tutorial-companion-title">The guidance box</p>
                            <p className="tutorial-companion-desc">Tells you what to say and what to do next. This is your script.</p>
                        </div>
                        <div className="tutorial-companion" style={{ borderLeftColor: 'var(--h-crimson)' }}>
                            <p className="tutorial-companion-title">The chair actions</p>
                            <p className="tutorial-companion-desc">Prominent buttons for whatever decision the meeting needs from you right now.</p>
                        </div>
                        <div className="tutorial-companion" style={{ borderLeftColor: 'var(--h-amber)' }}>
                            <p className="tutorial-companion-title">The top bar</p>
                            <p className="tutorial-companion-desc">Shows the meeting stage, organization name, and drawer toggles for participants, speaking queue, and meeting log.</p>
                        </div>
                    </div>

                    <h3>Call to order</h3>
                    <p>
                        The guidance box shows your opening script. Tap <strong>Call to Order</strong>.
                        That's it &mdash; the meeting has begun.
                    </p>

                    <h3>Roll call</h3>
                    <p>
                        The secretary (or you, if there's no secretary) calls each member's name by tapping
                        their card. Members tap <strong>Present</strong> on their own screens. Once everyone
                        has responded, you'll see a button to <strong>Complete Roll Call</strong>.
                    </p>
                    <aside className="tutorial-callout">
                        If you set a quorum, Hatsell tells you whether quorum is met. If it's not, you can't
                        proceed to business &mdash; the app will guide you.
                    </aside>

                    <h3>Approve minutes</h3>
                    <p>
                        If this isn't your first meeting, the guidance prompts you to ask for approval of the
                        previous meeting's minutes. Members can submit corrections. You can accept corrections
                        by general consent or put them to a vote.
                    </p>

                    <h3>New business</h3>
                    <p>This is where the real work happens.</p>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div><strong>A member makes a motion.</strong> They tap their "Make a Motion" button and type what they propose. You'll see it appear as a pending motion.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div><strong>You recognize it.</strong> Tap the motion to bring it to the floor. (If it's clearly out of order, you can reject it with an explanation.)</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div><strong>Another member seconds.</strong> The motion needs a second before debate can begin. If nobody seconds, you declare "no second" and the motion dies.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">4</span>
                            <div><strong>You state the question.</strong> The guidance gives you the script: "It is moved and seconded that [motion text]. Is there any debate?"</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">5</span>
                            <div><strong>Members debate.</strong> They join the speaking queue by tapping "Speak in Favor" or "Speak Against." You recognize them in order. The speaking timer tracks their time.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">6</span>
                            <div><strong>You call the vote.</strong> When debate is done (or a member moves to close debate), tap <strong>Call the Vote</strong>. Members vote Aye, Nay, or Abstain on their screens.</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">7</span>
                            <div><strong>You announce the result.</strong> Hatsell counts the votes and tells you whether the motion passed or failed. Tap <strong>Announce Result</strong> and the guidance gives you the script.</div>
                        </li>
                    </ol>

                    <h3>Handling interruptions</h3>
                    <p>During business, members can raise:</p>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">Point of order</td><td>A member thinks the rules are being broken. You'll see it immediately and must rule on it.</td></tr>
                                <tr><td className="ref-label">Parliamentary inquiry</td><td>A member has a question about procedure. Answer it and move on.</td></tr>
                                <tr><td className="ref-label">Amendments</td><td>A member wants to modify the motion on the floor. Amendments are debated and voted on before returning to the main motion.</td></tr>
                                <tr><td className="ref-label">Privileged motions</td><td>A member moves to recess or to adjourn. These take priority over regular business.</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <aside className="tutorial-callout tutorial-callout-tip">
                        Don't worry about remembering which of these is allowed when. Hatsell only shows members the options that are currently in order. If a button appears, they can use it.
                    </aside>

                    <h3>Adjourn</h3>
                    <p>
                        When there's no further business, tap <strong>Adjourn</strong> (or a member can move
                        to adjourn). The meeting ends. The log contains a complete record of everything that happened.
                    </p>
                </div>
            </section>

            {/* Part 3: Your toolkit */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>Part 3: Your toolkit</h2>

                    <h3>The drawers</h3>
                    <p>Tap the buttons in the top bar to open:</p>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">Members</td><td>Who's connected, their roles, and whether quorum is met. You can also set quorum here if you didn't set it during setup.</td></tr>
                                <tr><td className="ref-label">Queue</td><td>The speaking queue, showing who's waiting and their stance (for/against).</td></tr>
                                <tr><td className="ref-label">Log</td><td>A running record of every action taken in the meeting.</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>What the guidance box does for you</h3>
                    <p>
                        The guidance box updates at every stage and transition. It tells you what to say out loud
                        (in italic script text), what button to press next, and what the members are waiting for.
                    </p>
                    <aside className="tutorial-callout tutorial-callout-important">
                        If you ever feel lost, read the guidance box. It always knows where you are.
                    </aside>

                    <h3>When a member does something unexpected</h3>
                    <p>
                        Parliamentary procedure has a response for everything. If a member raises a point of order,
                        the guidance will tell you how to rule. If someone moves to table the motion, the app walks
                        you through it. If an appeal is made against your ruling, Hatsell handles the vote.
                    </p>
                    <p>
                        You don't need to anticipate these situations. Just respond when they come up &mdash; the app
                        will guide you through.
                    </p>
                </div>
            </section>

            {/* Quick reference */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>Quick reference</h2>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">Call to Order</td><td>Tap the button, read the script</td></tr>
                                <tr><td className="ref-label">Roll Call</td><td>Wait for members to respond, then complete</td></tr>
                                <tr><td className="ref-label">Minutes</td><td>Ask for corrections, approve</td></tr>
                                <tr><td className="ref-label">Business</td><td>Recognize motions, manage debate, call votes, announce results</td></tr>
                                <tr><td className="ref-label">Adjourn</td><td>Tap Adjourn or recognize a motion to adjourn</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>Tips</h2>
                    <ul className="tutorial-tip-list">
                        <li><strong>You don't need to talk fast.</strong> Parliamentary procedure is designed to be deliberate. Take your time.</li>
                        <li><strong>Read the scripts out loud.</strong> They're there for a reason &mdash; they set expectations for the members.</li>
                        <li><strong>Use the speaking timer.</strong> It keeps debate fair without you having to be the bad guy.</li>
                        <li><strong>Don't skip roll call</strong> for formal meetings. Quorum matters &mdash; it protects decisions from being challenged later.</li>
                        <li><strong>Check the log</strong> if you lose track. It records everything.</li>
                        <li><strong>Your first meeting will feel slow.</strong> That's normal. By the third meeting, the flow will feel natural.</li>
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
                        <button onClick={onMember}>Member Guide</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
