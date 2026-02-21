import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import HatsellLogo from './HatsellLogo';

export default function TutorialPage({ onBack, onOpenApp, onChair, onMember }) {
    const { t } = useTranslation('tutorials');
    const currentTab = 'general';

    return (
        <div className="tutorial-page">
            {/* Nav bar */}
            <header className="tutorial-nav">
                <div className="tutorial-nav-inner">
                    <button
                        className="tutorial-nav-brand"
                        onClick={onBack}
                        aria-label={t('nav_back_aria')}
                    >
                        <HatsellLogo small />
                        <span>{t('nav_brand')}</span>
                    </button>
                    <nav className="tutorial-nav-tabs" aria-label={t('nav_sections_aria')}>
                        <button className="tutorial-nav-tab active" onClick={() => {}}>
                            {t('nav_overview')}
                        </button>
                        <button className="tutorial-nav-tab" onClick={onChair}>
                            {t('nav_chair')}
                        </button>
                        <button className="tutorial-nav-tab" onClick={onMember}>
                            {t('nav_members')}
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
                    <h1>{t('overview_hero_title')}</h1>
                    <p>{t('overview_hero_desc')}</p>
                </div>
            </div>

            {/* Does this sound familiar? */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('overview_familiar_title')}</h2>

                    <h3>{t('overview_familiar_h1')}</h3>
                    <p>{t('overview_familiar_p1')}</p>
                    <p>{t('overview_familiar_p2')}</p>
                    <aside className="tutorial-callout">
                        {t('overview_familiar_callout1')}
                    </aside>

                    <h3>{t('overview_familiar_h2')}</h3>
                    <p>{t('overview_familiar_p3')}</p>
                    <aside className="tutorial-callout">
                        {t('overview_familiar_callout2')}
                    </aside>
                </div>
            </section>

            {/* What if the rules just ran themselves? */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('overview_whatif_title')}</h2>
                    <p>{t('overview_whatif_p1')}</p>
                    <p>{t('overview_whatif_p2')}</p>
                    <aside className="tutorial-callout tutorial-callout-important">
                        <Trans i18nKey="tutorials:overview_whatif_callout" components={{ strong: <strong /> }} />
                    </aside>
                </div>
            </section>

            {/* How Hatsell works */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('overview_how_title')}</h2>
                    <p>{t('overview_how_intro')}</p>

                    <h3>{t('overview_how_code_title')}</h3>
                    <p>{t('overview_how_code_desc')}</p>

                    <h3>{t('overview_how_guide_title')}</h3>
                    <p>{t('overview_how_guide_desc')}</p>

                    <h3>{t('overview_how_options_title')}</h3>
                    <p>{t('overview_how_options_desc')}</p>

                    <h3>{t('overview_how_debate_title')}</h3>
                    <p>{t('overview_how_debate_desc')}</p>

                    <h3>{t('overview_how_decisions_title')}</h3>
                    <p>{t('overview_how_decisions_desc')}</p>
                </div>
            </section>

            {/* A meeting in five minutes */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('overview_fivemin_title')}</h2>
                    <p>{t('overview_fivemin_intro')}</p>

                    <ol className="tutorial-steps">
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">1</span>
                            <div>
                                <Trans i18nKey="tutorials:overview_step1_title" components={{ strong: <strong /> }} />{' '}
                                {t('overview_step1_desc')}
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">2</span>
                            <div>
                                <Trans i18nKey="tutorials:overview_step2_title" components={{ strong: <strong /> }} />{' '}
                                {t('overview_step2_desc')}
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">3</span>
                            <div>
                                <Trans i18nKey="tutorials:overview_step3_title" components={{ strong: <strong /> }} />{' '}
                                {t('overview_step3_desc')}
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">4</span>
                            <div>
                                <Trans i18nKey="tutorials:overview_step4_title" components={{ strong: <strong /> }} />{' '}
                                {t('overview_step4_desc')}
                            </div>
                        </li>
                        <li className="tutorial-step">
                            <span className="tutorial-step-number">5</span>
                            <div>
                                <Trans i18nKey="tutorials:overview_step5_title" components={{ strong: <strong /> }} />{' '}
                                {t('overview_step5_desc')}
                            </div>
                        </li>
                    </ol>

                    <aside className="tutorial-callout tutorial-callout-tip">
                        <Trans i18nKey="tutorials:overview_fivemin_callout" components={{ strong: <strong /> }} />
                    </aside>
                </div>
            </section>

            {/* What you don't need to know */}
            <section className="tutorial-section">
                <div className="tutorial-section-inner">
                    <h2>{t('overview_noneed_title')}</h2>
                    <p>{t('overview_noneed_p1')}</p>
                    <p>{t('overview_noneed_p2')}</p>
                    <p>{t('overview_noneed_p3')}</p>
                </div>
            </section>

            {/* Ready to dive in? */}
            <section className="tutorial-section tutorial-section-alt">
                <div className="tutorial-section-inner">
                    <h2>{t('overview_ready_title')}</h2>
                    <p>{t('overview_ready_desc')}</p>
                    <div className="tutorial-cards">
                        <button className="tutorial-card" onClick={onChair}>
                            <h3>{t('overview_card_chair_title')}</h3>
                            <p>{t('overview_card_chair_desc')}</p>
                        </button>
                        <button className="tutorial-card" onClick={onMember}>
                            <h3>{t('overview_card_member_title')}</h3>
                            <p>{t('overview_card_member_desc')}</p>
                        </button>
                    </div>

                    <div className="tutorial-cta">
                        <button onClick={onOpenApp}>
                            {t('open_hatsell')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="tutorial-footer">
                <div className="tutorial-footer-inner">
                    <div className="tutorial-footer-links">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            {t('nav_overview')}
                        </button>
                        <span className="separator">|</span>
                        <button onClick={onOpenApp}>
                            {t('open_hatsell')}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
