import React from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES } from '../constants';
import HatsellLogo from './HatsellLogo';

export default function TopBar({
    meetingState,
    currentUser,
    activeDrawer,
    onToggleDrawer,
    onLogout,
    onAbout,
}) {
    const { t } = useTranslation('meeting');

    const STAGE_LABELS = {
        [MEETING_STAGES.NOT_STARTED]: t('topbar_stage_not_started'),
        [MEETING_STAGES.CALL_TO_ORDER]: t('topbar_stage_call_to_order'),
        [MEETING_STAGES.ROLL_CALL]: t('topbar_stage_roll_call'),
        [MEETING_STAGES.APPROVE_MINUTES]: t('topbar_stage_approve_minutes'),
        [MEETING_STAGES.ADOPT_AGENDA]: t('topbar_stage_adopt_agenda'),
        [MEETING_STAGES.AGENDA_ITEM]: t('topbar_stage_agenda_item'),
        [MEETING_STAGES.REPORTS]: t('topbar_stage_reports'),
        [MEETING_STAGES.UNFINISHED_BUSINESS]: t('topbar_stage_unfinished_business'),
        [MEETING_STAGES.NEW_BUSINESS]: t('topbar_stage_new_business'),
        [MEETING_STAGES.MOTION_DISCUSSION]: t('topbar_stage_motion_discussion'),
        [MEETING_STAGES.VOTING]: t('topbar_stage_voting'),
        [MEETING_STAGES.RECESS]: t('topbar_stage_recess'),
        [MEETING_STAGES.SUSPENDED_RULES]: t('topbar_stage_suspended_rules'),
        [MEETING_STAGES.ADJOURNED]: t('topbar_stage_adjourned'),
    };

    const orgName = meetingState.orgProfile?.organizationName || 'Hatsell';
    const stageLabel = STAGE_LABELS[meetingState.stage] || meetingState.stage;
    const participantCount = meetingState.participants?.length || 0;
    const queueCount = (meetingState.speakingQueue?.length || 0) + (meetingState.currentSpeaker ? 1 : 0);
    const logCount = meetingState.log?.length || 0;

    return (
        <nav className="topbar" aria-label="Meeting toolbar">
            <div className="topbar-left">
                <HatsellLogo small />
                <span className="topbar-org-name">{orgName}</span>
                {meetingState.meetingCode && (
                    <span className="topbar-meeting-code">{meetingState.meetingCode}</span>
                )}
            </div>

            <div className="topbar-center">
                <span className="topbar-stage-badge">{stageLabel}</span>
            </div>

            <div className="topbar-right">
                <button
                    className={`drawer-toggle ${activeDrawer === 'members' ? 'active' : ''}`}
                    onClick={() => onToggleDrawer('members')}
                    aria-pressed={activeDrawer === 'members'}
                >
                    {t('topbar_members')}<span className="drawer-toggle-count">{participantCount}</span>
                </button>
                <button
                    className={`drawer-toggle ${activeDrawer === 'queue' ? 'active' : ''}`}
                    onClick={() => onToggleDrawer('queue')}
                    aria-pressed={activeDrawer === 'queue'}
                >
                    {t('topbar_queue')}<span className="drawer-toggle-count">{queueCount}</span>
                </button>
                <button
                    className={`drawer-toggle ${activeDrawer === 'log' ? 'active' : ''}`}
                    onClick={() => onToggleDrawer('log')}
                    aria-pressed={activeDrawer === 'log'}
                >
                    {t('topbar_log')}<span className="drawer-toggle-count">{logCount}</span>
                </button>
                <button className="topbar-leave" onClick={onLogout}>
                    {t('topbar_leave')}
                </button>
            </div>
        </nav>
    );
}
