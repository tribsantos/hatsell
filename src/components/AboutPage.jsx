import React from 'react';
import { useTranslation } from 'react-i18next';
import HatsellLogo from './HatsellLogo';

export default function AboutPage({ onBack }) {
    const { t } = useTranslation(['meeting', 'common']);

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo-container">
                    <HatsellLogo />
                    <h1>{t('common:app_name')}</h1>
                </div>
                <p className="subtitle">{t('about_subtitle', { ns: 'meeting' })}</p>
                <div style={{ marginTop: '0.75rem' }}>
                    <button onClick={onBack} className="ghost">
                        {t('about_back', { ns: 'meeting' })}
                    </button>
                </div>
            </header>

            <div className="about-container">
                <section className="about-section">
                    <h2>{t('about_title', { ns: 'meeting' })}</h2>
                    <p>
                        {t('about_p1', { ns: 'meeting' })}
                    </p>
                    <p>
                        {t('about_p2', { ns: 'meeting' })}
                    </p>
                </section>

                <section className="about-section">
                    <h2>{t('about_quick_start_title', { ns: 'meeting' })}</h2>
                    <ol className="quick-start-list">
                        <li>
                            <strong>{t('about_qs1_title', { ns: 'meeting' })}</strong> &mdash; {t('about_qs1_body', { ns: 'meeting' })}
                        </li>
                        <li>
                            <strong>{t('about_qs2_title', { ns: 'meeting' })}</strong> &mdash; {t('about_qs2_body', { ns: 'meeting' })}
                        </li>
                        <li>
                            <strong>{t('about_qs3_title', { ns: 'meeting' })}</strong> &mdash; {t('about_qs3_body', { ns: 'meeting' })}
                        </li>
                        <li>
                            <strong>{t('about_qs4_title', { ns: 'meeting' })}</strong> &mdash; {t('about_qs4_body', { ns: 'meeting' })}
                        </li>
                        <li>
                            <strong>{t('about_qs5_title', { ns: 'meeting' })}</strong> &mdash; {t('about_qs5_body', { ns: 'meeting' })}
                        </li>
                        <li>
                            <strong>{t('about_qs6_title', { ns: 'meeting' })}</strong> &mdash; {t('about_qs6_body', { ns: 'meeting' })}
                        </li>
                    </ol>
                </section>

                <section className="about-section">
                    <h2>{t('about_support_title', { ns: 'meeting' })}</h2>
                    <div className="book-promo">
                        <div className="book-promo-content">
                            <h3>"Why Not Parliamentarism?"</h3>
                            <p className="book-author">{t('about_book_author', { ns: 'meeting' })}</p>
                            <p>
                                {t('about_book_desc', { ns: 'meeting' })}
                            </p>
                            <div className="book-links">
                                <a
                                    href="https://www.amazon.com/Why-parliamentarism-Tiago-Ribeiro-Santos/dp/B08GFX3MM3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('about_book_us', { ns: 'meeting' })}
                                </a>
                                <a
                                    href="https://www.amazon.co.uk/Why-parliamentarism-Tiago-Ribeiro-Santos/dp/B08GFX3MM3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('about_book_uk', { ns: 'meeting' })}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>{t('about_disclaimer_title', { ns: 'meeting' })}</h2>
                    <p>
                        {t('about_disclaimer_text', { ns: 'meeting' })}
                    </p>
                </section>

                <section className="about-section">
                    <h2>{t('about_credits_title', { ns: 'meeting' })}</h2>
                    <p>{t('about_version', { ns: 'meeting' })}</p>
                    <p>{t('about_created_by', { ns: 'meeting' })}</p>
                </section>
            </div>
        </div>
    );
}
