import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import HatsellLogo from './HatsellLogo';

export default function TutorialChairPage({ onBack, onOpenApp, onOverview, onMember }) {
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
                        <button className="tutorial-nav-tab active">{t('nav_chair')}</button>
                        <button className="tutorial-nav-tab" onClick={onMember}>{t('nav_members')}</button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <div className="tutorial-hero">
                <div className="tutorial-hero-inner">
                    <div className="tutorial-hero-logo">
                        <HatsellLogo />
                    </div>
                    <h1>{t('chair_hero_title')}</h1>
                    <p>
                        <Trans i18nKey="tutorials:chair_hero_desc" components={{ mdash: <>&mdash;</> }} />
                    </p>
                </div>
            </div>

            {/* Part 1: Before the meeting */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('chair_before_title')}</h2>

                    <h3>{t('chair_create_title')}</h3>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div>{t('chair_create_step1')}</div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div><Trans i18nKey="tutorials:chair_create_step2" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div>
                                <Trans i18nKey="tutorials:chair_create_step3" components={{ mdash: <>&mdash;</> }} />
                            </div>
                        </li>
                    </ol>

                    <h3>{t('chair_org_title')}</h3>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">{t('chair_org_name_label')}</td><td>{t('chair_org_name_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_org_membership_label')}</td><td>{t('chair_org_membership_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_org_quorum_label')}</td><td>{t('chair_org_quorum_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_org_voting_label')}</td><td>{t('chair_org_voting_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_org_debate_label')}</td><td>{t('chair_org_debate_desc')}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>{t('chair_settings_title')}</h3>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">{t('chair_settings_name_label')}</td><td>{t('chair_settings_name_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_settings_agenda_label')}</td><td>{t('chair_settings_agenda_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_settings_notice_label')}</td><td>{t('chair_settings_notice_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_settings_type_label')}</td><td>{t('chair_settings_type_desc')}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <aside className="tutorial-callout tutorial-callout-tip">
                        {t('chair_settings_callout')}
                    </aside>

                    <h3>{t('chair_codes_title')}</h3>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">4</span>
                            <div><Trans i18nKey="tutorials:chair_codes_step1" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">5</span>
                            <div><Trans i18nKey="tutorials:chair_codes_step2" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">6</span>
                            <div><Trans i18nKey="tutorials:chair_codes_step3" components={{ strong: <strong /> }} /></div>
                        </li>
                    </ol>
                </div>
            </section>

            {/* Part 2: Running the meeting */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('chair_running_title')}</h2>
                    <p>{t('chair_running_intro')}</p>

                    <div className="tutorial-companion-list">
                        <div className="tutorial-companion" style={{ borderLeftColor: 'var(--h-red)' }}>
                            <p className="tutorial-companion-title">{t('chair_companion_guidance_title')}</p>
                            <p className="tutorial-companion-desc">{t('chair_companion_guidance_desc')}</p>
                        </div>
                        <div className="tutorial-companion" style={{ borderLeftColor: 'var(--h-crimson)' }}>
                            <p className="tutorial-companion-title">{t('chair_companion_actions_title')}</p>
                            <p className="tutorial-companion-desc">{t('chair_companion_actions_desc')}</p>
                        </div>
                        <div className="tutorial-companion" style={{ borderLeftColor: 'var(--h-amber)' }}>
                            <p className="tutorial-companion-title">{t('chair_companion_topbar_title')}</p>
                            <p className="tutorial-companion-desc">{t('chair_companion_topbar_desc')}</p>
                        </div>
                    </div>

                    <h3>{t('chair_order_title')}</h3>
                    <p>
                        <Trans i18nKey="tutorials:chair_order_desc" components={{ strong: <strong />, mdash: <>&mdash;</> }} />
                    </p>

                    <h3>{t('chair_roll_title')}</h3>
                    <p>
                        <Trans i18nKey="tutorials:chair_roll_desc" components={{ strong: <strong /> }} />
                    </p>
                    <aside className="tutorial-callout">
                        <Trans i18nKey="tutorials:chair_roll_callout" components={{ mdash: <>&mdash;</> }} />
                    </aside>

                    <h3>{t('chair_minutes_title')}</h3>
                    <p>
                        {t('chair_minutes_desc')}
                    </p>

                    <h3>{t('chair_business_title')}</h3>
                    <p>{t('chair_business_intro')}</p>
                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div><Trans i18nKey="tutorials:chair_business_step1" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div><Trans i18nKey="tutorials:chair_business_step2" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div><Trans i18nKey="tutorials:chair_business_step3" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">4</span>
                            <div><Trans i18nKey="tutorials:chair_business_step4" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">5</span>
                            <div><Trans i18nKey="tutorials:chair_business_step5" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">6</span>
                            <div><Trans i18nKey="tutorials:chair_business_step6" components={{ strong: <strong /> }} /></div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">7</span>
                            <div><Trans i18nKey="tutorials:chair_business_step7" components={{ strong: <strong /> }} /></div>
                        </li>
                    </ol>

                    <h3>{t('chair_interruptions_title')}</h3>
                    <p>{t('chair_interruptions_intro')}</p>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">{t('chair_int_poo_label')}</td><td>{t('chair_int_poo_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_int_inquiry_label')}</td><td>{t('chair_int_inquiry_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_int_amend_label')}</td><td>{t('chair_int_amend_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_int_priv_label')}</td><td>{t('chair_int_priv_desc')}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <aside className="tutorial-callout tutorial-callout-tip">
                        {t('chair_interruptions_callout')}
                    </aside>

                    <h3>{t('chair_adjourn_title')}</h3>
                    <p>
                        <Trans i18nKey="tutorials:chair_adjourn_desc" components={{ strong: <strong /> }} />
                    </p>
                </div>
            </section>

            {/* Part 3: Your toolkit */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('chair_toolkit_title')}</h2>

                    <h3>{t('chair_drawers_title')}</h3>
                    <p>{t('chair_drawers_intro')}</p>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">{t('chair_drawer_members_label')}</td><td>{t('chair_drawer_members_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_drawer_queue_label')}</td><td>{t('chair_drawer_queue_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_drawer_log_label')}</td><td>{t('chair_drawer_log_desc')}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>{t('chair_guidance_title')}</h3>
                    <p>
                        {t('chair_guidance_desc')}
                    </p>
                    <aside className="tutorial-callout tutorial-callout-important">
                        {t('chair_guidance_callout')}
                    </aside>

                    <h3>{t('chair_unexpected_title')}</h3>
                    <p>
                        {t('chair_unexpected_p1')}
                    </p>
                    <p>
                        <Trans i18nKey="tutorials:chair_unexpected_p2" components={{ mdash: <>&mdash;</> }} />
                    </p>
                </div>
            </section>

            {/* Quick reference */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('chair_ref_title')}</h2>
                    <div className="tutorial-ref-table">
                        <table>
                            <tbody>
                                <tr><td className="ref-label">{t('chair_ref_order_label')}</td><td>{t('chair_ref_order_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_ref_roll_label')}</td><td>{t('chair_ref_roll_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_ref_minutes_label')}</td><td>{t('chair_ref_minutes_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_ref_business_label')}</td><td>{t('chair_ref_business_desc')}</td></tr>
                                <tr><td className="ref-label">{t('chair_ref_adjourn_label')}</td><td>{t('chair_ref_adjourn_desc')}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('chair_tips_title')}</h2>
                    <ul className="tutorial-tip-list">
                        <li><Trans i18nKey="tutorials:chair_tip1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:chair_tip2" components={{ strong: <strong />, mdash: <>&mdash;</> }} /></li>
                        <li><Trans i18nKey="tutorials:chair_tip3" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:chair_tip4" components={{ strong: <strong />, mdash: <>&mdash;</> }} /></li>
                        <li><Trans i18nKey="tutorials:chair_tip5" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="tutorials:chair_tip6" components={{ strong: <strong /> }} /></li>
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
                        <button onClick={onMember}>{t('member_guide')}</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
