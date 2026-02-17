import React from 'react';
import HatsellLogo from './HatsellLogo';

export default function AboutPage({ onBack }) {
    return (
        <div className="app-container">
            <header className="header">
                <div className="logo-container">
                    <HatsellLogo />
                    <h1>Hatsell</h1>
                </div>
                <p className="subtitle">Based on Robert's Rules of Order</p>
                <div style={{ marginTop: '0.75rem' }}>
                    <button onClick={onBack} className="ghost">
                        Back
                    </button>
                </div>
            </header>

            <div className="about-container">
                <section className="about-section">
                    <h2>About Hatsell</h2>
                    <p>
                        Hatsell is a real-time parliamentary meeting assistant that guides groups through
                        formal meetings using Robert's Rules of Order, Newly Revised (RONR). It manages
                        the full lifecycle of a meeting: calling to order, roll call, motions, debate,
                        voting, and adjournment.
                    </p>
                    <p>
                        Named after John Hatsell, the 18th-century Clerk of the House of Commons whose
                        procedural writings influenced Thomas Jefferson and ultimately Robert's Rules itself.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Quick Start</h2>
                    <ol className="quick-start-list">
                        <li>
                            <strong>Chair creates the meeting</strong> &mdash; Select "President/Chair" as
                            your role and click "Start Meeting." A meeting code is generated automatically.
                        </li>
                        <li>
                            <strong>Share the code</strong> &mdash; Give the meeting code to all participants
                            so they can join.
                        </li>
                        <li>
                            <strong>Participants join</strong> &mdash; Each member selects their role, enters
                            the meeting code, and clicks "Join Meeting."
                        </li>
                        <li>
                            <strong>Call to order &amp; roll call</strong> &mdash; The Chair calls the meeting
                            to order, then the Secretary completes roll call.
                        </li>
                        <li>
                            <strong>Conduct business</strong> &mdash; Members make motions, debate, and vote.
                            Hatsell enforces the proper order of precedence automatically.
                        </li>
                        <li>
                            <strong>Adjourn</strong> &mdash; When all business is complete, the Chair adjourns
                            the meeting. You can export minutes as a .docx file.
                        </li>
                    </ol>
                </section>

                <section className="about-section">
                    <h2>Support My Work</h2>
                    <div className="book-promo">
                        <div className="book-promo-content">
                            <h3>"Why Not Parliamentarism?"</h3>
                            <p className="book-author">by Tiago Ribeiro dos Santos</p>
                            <p>
                                Are you convinced that parliamentary procedure helps your meetings
                                to run smoother, fairer and more efficiently? Imagine what it could
                                do for your country. "Why Not Parliamentarism?" is the common-sense,
                                evidence and theory-based case for parliamentarism everywhere.
                            </p>
                            <div className="book-links">
                                <a
                                    href="https://www.amazon.com/Why-parliamentarism-Tiago-Ribeiro-Santos/dp/B08GFX3MM3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Amazon US
                                </a>
                                <a
                                    href="https://www.amazon.co.uk/Why-parliamentarism-Tiago-Ribeiro-Santos/dp/B08GFX3MM3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Amazon UK
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Disclaimer</h2>
                    <p>
                        Hatsell is a tool to help meetings using a parliamentary authority. It is
                        not supposed to replace them. Any conflict between Hatsell and the chosen
                        parliamentary authority should be decided in favor of the official text.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Credits</h2>
                    <p>Version 1.0.0</p>
                    <p>Created by Tiago Ribeiro dos Santos</p>
                </section>
            </div>
        </div>
    );
}
