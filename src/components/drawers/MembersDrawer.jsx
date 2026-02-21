import React from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES, ROLES } from '../../constants';
import DrawerOverlay from '../DrawerOverlay';
import QuorumSettingSection from '../QuorumSettingSection';
import TabledMotionsList from '../TabledMotionsList';
import DecidedMotionsList from '../DecidedMotionsList';
import { formatQuorumRule } from '../../engine/quorum';

export default function MembersDrawer({ meetingState, currentUser, isChair, onSetQuorum, onClose }) {
    const { t } = useTranslation('meeting');
    const participants = meetingState.participants || [];

    // Quorum display logic (same as old sidebar)
    const rollCallDone = meetingState.stage !== MEETING_STAGES.NOT_STARTED &&
        meetingState.stage !== MEETING_STAGES.CALL_TO_ORDER &&
        meetingState.stage !== MEETING_STAGES.ROLL_CALL;
    let presentCount;
    if (rollCallDone && meetingState.rollCallStatus) {
        const officerCount = participants.filter(p =>
            p.role === ROLES.PRESIDENT || p.role === ROLES.VICE_PRESIDENT || p.role === ROLES.SECRETARY
        ).length;
        const respondedCount = Object.values(meetingState.rollCallStatus).filter(v => v === 'present').length;
        presentCount = officerCount + respondedCount;
    } else {
        presentCount = participants.length;
    }
    const quorumMet = meetingState.quorumRule ? presentCount >= meetingState.quorum : null;

    const showQuorumSetting = isChair && !meetingState.quorumRule && (
        meetingState.stage === MEETING_STAGES.CALL_TO_ORDER ||
        meetingState.stage === MEETING_STAGES.ROLL_CALL
    );

    return (
        <DrawerOverlay title={t('drawer_members_title', { count: participants.length })} onClose={onClose}>
            <ul className="participants-list">
                {participants.map((p, idx) => (
                    <li
                        key={idx}
                        className={`participant-item ${
                            p.role === ROLES.PRESIDENT ? 'chair' : ''
                        } ${
                            p.role === ROLES.VICE_PRESIDENT ? 'vice-president' : ''
                        } ${
                            p.role === ROLES.SECRETARY ? 'secretary' : ''
                        } ${
                            meetingState.currentSpeaker?.participant === p.name ? 'speaking' : ''
                        }`}
                    >
                        <div className="participant-name">{p.name}</div>
                        <div className="participant-role">{p.role}</div>
                    </li>
                ))}
            </ul>

            {meetingState.quorumRule && (
                <div className={`quorum-indicator ${quorumMet ? 'met' : 'not-met'}`}>
                    <strong>{t('quorum_label')}</strong> {t('quorum_present_of_required', { present: presentCount, required: meetingState.quorum })}
                    <br />
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>
                        {t('quorum_rule_label', { rule: formatQuorumRule(meetingState.quorumRule) })}
                    </span>
                </div>
            )}

            {showQuorumSetting && (
                <div style={{ marginTop: '1rem' }}>
                    <QuorumSettingSection
                        onSetQuorum={onSetQuorum}
                        currentRule={meetingState.quorumRule}
                    />
                </div>
            )}

            <TabledMotionsList tabledMotions={meetingState.tabledMotions} isChair={isChair} />
            <DecidedMotionsList decidedMotions={meetingState.decidedMotions} />
        </DrawerOverlay>
    );
}
