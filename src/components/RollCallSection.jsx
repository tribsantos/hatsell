import React from 'react';
import { useTranslation } from 'react-i18next';
import { ROLES } from '../constants';

export default function RollCallSection({ participants, rollCallStatus, currentUser, isChair, onCallMember, onRespondToRollCall, onMarkPresent }) {
    const { t } = useTranslation('meeting');
    const myStatus = rollCallStatus[currentUser.name];
    const wasICalled = myStatus === 'called' || myStatus === 'present';

    const membersToCall = participants.filter((p) =>
        p.role !== ROLES.PRESIDENT &&
        p.role !== ROLES.VICE_PRESIDENT &&
        p.role !== ROLES.SECRETARY
    );

    const canConductRollCall = currentUser.role === ROLES.SECRETARY || isChair;

    return (
        <div className="panel" style={{ marginBottom: '1.5rem' }}>
            <h3>{t('roll_call_title')}</h3>

            {canConductRollCall ? (
                <div>
                    <div className="info-box" style={{ marginBottom: '1rem' }}>
                        {t('roll_call_officers_note')}
                    </div>

                    {membersToCall.length === 0 ? (
                        <div>
                            <p style={{ marginBottom: '0.5rem', color: '#444' }}>
                                {t('roll_call_all_officers')}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                {t('roll_call_click_complete')}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p style={{ marginBottom: '0.75rem', color: '#444' }}>
                                {t('roll_call_instructions')}
                            </p>

                            <div className="roll-call-grid">
                                {membersToCall.map((p, idx) => {
                                    const status = rollCallStatus[p.name];
                                    const isPresent = status === 'present';
                                    const isCalled = status === 'called';
                                    const statusClass = isPresent ? 'status-present' : isCalled ? 'status-called' : '';
                                    const statusLabel = isPresent ? t('roll_call_status_present') : isCalled ? t('roll_call_status_called') : t('roll_call_status_click');
                                    const initial = p.name ? p.name.charAt(0).toUpperCase() : '?';

                                    const handleClick = () => {
                                        if (isPresent) return;
                                        if (isCalled) {
                                            onMarkPresent(p.name);
                                        } else {
                                            onCallMember(p.name);
                                        }
                                    };

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={handleClick}
                                            disabled={isPresent}
                                            className={`roll-call-card ${statusClass}`}
                                        >
                                            <div className="roll-call-avatar">
                                                {isPresent ? '\u2713' : initial}
                                            </div>
                                            <div className="roll-call-card-info">
                                                <div className="roll-call-card-name">{p.name}</div>
                                                <div className="roll-call-card-status">{statusLabel}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    {currentUser.role === ROLES.PRESIDENT || currentUser.role === ROLES.VICE_PRESIDENT ? (
                        <div className="info-box">
                            <strong>{t('roll_call_auto_present_officer', { role: currentUser.role })}</strong>
                            <p style={{ marginTop: '0.5rem' }}>{t('roll_call_secretary_conducting')}</p>
                        </div>
                    ) : currentUser.role === ROLES.SECRETARY ? (
                        <div className="info-box">
                            <strong>{t('roll_call_auto_present_secretary')}</strong>
                        </div>
                    ) : !wasICalled ? (
                        <p style={{ color: '#666' }}>{t('roll_call_waiting')}</p>
                    ) : myStatus === 'present' ? (
                        <div className="info-box">
                            <strong>{t('roll_call_responded')}</strong>
                        </div>
                    ) : (
                        <div>
                            <div className="warning-box" style={{ marginBottom: '1rem' }}>
                                <strong>{t('roll_call_your_name_called')}</strong>
                            </div>
                            <button type="button" onClick={onRespondToRollCall} className="roll-call-respond-btn success">
                                {t('roll_call_present_button')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
