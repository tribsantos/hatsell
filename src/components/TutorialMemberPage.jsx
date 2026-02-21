import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import HatsellLogo from './HatsellLogo';

export default function TutorialMemberPage({ onBack, onOpenApp, onOverview, onChair }) {
    const { t } = useTranslation('tutorials');

    return (
        <div className="tutorial-page">
            {/* Nav bar */}
            <header className="tutorial-nav">
                <div className="tutorial-nav-inner">
                    <button className="tutorial-nav-brand" onClick={onBack} aria-label={t('nav_back_aria')}>
                        <HatsellLogo small />
                        <span>{t('nav_brand')}</span>
                    </button>
                    <nav className="tutorial-nav-tabs" aria-label={t('nav_sections_aria')}>
                        <button className="tutorial-nav-tab" onClick={onOverview}>{t('nav_overview')}</button>
                        <button className="tutorial-nav-tab" onClick={onChair}>{t('nav_chair')}</button>
                        <button className="tutorial-nav-tab active">{t('nav_members')}</button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <div className="tutorial-hero">
                <div className="tutorial-hero-inner">
                    <div className="tutorial-hero-logo">
                        <HatsellLogo />
                    </div>
                    <h1>{t('member_hero_title')}</h1>
                    <p>
                        <Trans i18nKey="tutorials:member_hero_desc" components={{ mdash: <>&mdash;</> }} />
                    </p>
                </div>
            </div>

            {/* Joining */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('member_joining_title')}</h2>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div>{t('member_join_step1')}</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div><Trans i18nKey="tutorials:member_join_step2" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div>{t('member_join_step3')}</div>
                        </li>
                    </ol>
                    <aside className="tutorial-callout tutorial-callout-tip">
                        <Trans i18nKey="tutorials:member_join_callout" components={{ mdash: <>&mdash;</> }} />
                    </aside>
                </div>
            </section>

            {/* The meeting flow */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('member_flow_title')}</h2>
                    <p>
                        <Trans i18nKey="tutorials:member_flow_intro" components={{ mdash: <>&mdash;</> }} />
                    </p>

                    <h3>{t('member_roll_title')}</h3>
                    <p>
                        <Trans i18nKey="tutorials:member_roll_desc" components={{ strong: <strong /> }} />
                    </p>

                    <h3>{t('member_minutes_title')}</h3>
                    <p>
                        {t('member_minutes_desc')}
                    </p>
                    <ul className="tutorial-tip-list">
                        <li><Trans i18nKey="tutorials:member_minutes_opt1" components={{ mdash: <>&mdash;</> }} /></li>
                        <li><Trans i18nKey="tutorials:member_minutes_opt2" components={{ strong: <strong /> }} /></li>
                    </ul>
                </div>
            </section>

            {/* Business */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2><Trans i18nKey="tutorials:member_business_title" components={{ mdash: <>&mdash;</> }} /></h2>
                    <p>{t('member_business_intro')}</p>

                    <h3>{t('member_motion_title')}</h3>
                    <p>
                        <Trans i18nKey="tutorials:member_motion_p1" components={{ strong: <strong />, mdash: <>&mdash;</> }} />
                    </p>
                    <p>
                        <Trans i18nKey="tutorials:member_motion_p2" components={{ strong: <strong /> }} />
                    </p>

                    <h3>{t('member_second_title')}</h3>
                    <p>
                        <Trans i18nKey="tutorials:member_second_desc" components={{ strong: <strong />, mdash: <>&mdash;</> }} />
                    </p>

                    <h3>{t('member_speaking_title')}</h3>
                    <p>
                        {t('member_speaking_intro')}
                    </p>
                    <div className="tutorial-stance-cards">
                        <div className="tutorial-stance-card tutorial-stance-favor">
                            <p className="tutorial-stance-title">{t('member_stance_favor_title')}</p>
                            <p className="tutorial-stance-desc">{t('member_stance_favor_desc')}</p>
                        </div>
                        <div className="tutorial-stance-card tutorial-stance-against">
                            <p className="tutorial-stance-title">{t('member_stance_against_title')}</p>
                            <p className="tutorial-stance-desc">{t('member_stance_against_desc')}</p>
                        </div>
                    </div>
                    <p>
                        <Trans i18nKey="tutorials:member_speaking_desc" components={{ strong: <strong />, mdash: <>&mdash;</> }} />
                    </p>

                    <h3>{t('member_voting_title')}</h3>
                    <p>{t('member_voting_intro')}</p>
                    <div className="tutorial-vote-preview">
                        <span className="tutorial-vote-btn aye">{t('meeting:vote_aye')}</span>
                        <span className="tutorial-vote-btn nay">{t('meeting:vote_nay')}</span>
                        <span className="tutorial-vote-btn abstain">{t('meeting:vote_abstain')}</span>
                    </div>
                    <p>
                        {t('member_voting_desc')}
                    </p>
                </div>
            </section>

            {/* Other things you can do */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('member_other_title')}</h2>
                    <p>
                        {t('member_other_intro')}
                    </p>
                    <aside className="tutorial-callout tutorial-callout-important">
                        {t('member_other_callout')}
                    </aside>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">{t('member_amend_label')}</td><td>{t('member_amend_desc')}</td></tr>
                                <tr><td className="ref-label">{t('member_poo_label')}</td><td>{t('member_poo_desc')}</td></tr>
                                <tr><td className="ref-label">{t('member_inquiry_label')}</td><td>{t('member_inquiry_desc')}</td></tr>
                                <tr><td className="ref-label">{t('member_info_label')}</td><td>{t('member_info_desc')}</td></tr>
                                <tr><td className="ref-label">{t('member_appeal_label')}</td><td><Trans i18nKey="tutorials:member_appeal_desc" components={{ mdash: <>&mdash;</> }} /></td></tr>
                                <tr><td className="ref-label">{t('member_adjourn_label')}</td><td>{t('member_adjourn_desc')}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* What you'll see on screen */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('member_screen_title')}</h2>
                    <div className="tutorial-screen-cards">
                        <div className="tutorial-screen-card">
                            <h3>{t('member_screen_stage_title')}</h3>
                            <p>{t('member_screen_stage_desc')}</p>
                        </div>
                        <div className="tutorial-screen-card">
                            <h3>{t('member_screen_motion_title')}</h3>
                            <p>{t('member_screen_motion_desc')}</p>
                        </div>
                        <div className="tutorial-screen-card tutorial-screen-card-highlight">
                            <h3>{t('member_screen_actions_title')}</h3>
                            <p>{t('member_screen_actions_desc')}</p>
                        </div>
                        <div className="tutorial-screen-card">
                            <h3>{t('member_screen_topbar_title')}</h3>
                            <p>{t('member_screen_topbar_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('member_tips_title')}</h2>
                    <ul className="tutorial-tip-list">
                        <li><Trans i18nKey="tutorials:member_tip1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:member_tip2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:member_tip3" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:member_tip4" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:member_tip5" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:member_tip6" components={{ strong: <strong /> }} /></li>
                    </ul>
                </div>
            </section>

            {/* Footer */}
            <footer className="tutorial-footer">
                <div className="tutorial-footer-inner">
                    <div className="tutorial-cta">
                        <button onClick={onOpenApp}>{t('open_hatsell')}</button>
                    </div>
                    <div className="tutorial-footer-links" style={{ marginTop: '1rem' }}>
                        <button onClick={onOverview}>{t('nav_overview')}</button>
                        <span className="separator">|</span>
                        <button onClick={onChair}>{t('chair_guide')}</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
