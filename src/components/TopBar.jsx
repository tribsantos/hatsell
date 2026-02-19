import React from 'react';
import { MEETING_STAGES } from '../constants';
import HatsellLogo from './HatsellLogo';

const STAGE_LABELS = {
    [MEETING_STAGES.NOT_STARTED]: 'Not Started',
    [MEETING_STAGES.CALL_TO_ORDER]: 'Call to Order',
    [MEETING_STAGES.ROLL_CALL]: 'Roll Call',
    [MEETING_STAGES.APPROVE_MINUTES]: 'Minutes',
    [MEETING_STAGES.ADOPT_AGENDA]: 'Adopt Agenda',
    [MEETING_STAGES.AGENDA_ITEM]: 'Agenda',
    [MEETING_STAGES.REPORTS]: 'Reports',
    [MEETING_STAGES.UNFINISHED_BUSINESS]: 'Unfinished Business',
    [MEETING_STAGES.NEW_BUSINESS]: 'New Business',
    [MEETING_STAGES.MOTION_DISCUSSION]: 'Discussion',
    [MEETING_STAGES.VOTING]: 'Voting',
    [MEETING_STAGES.RECESS]: 'Recess',
    [MEETING_STAGES.SUSPENDED_RULES]: 'Rules Suspended',
    [MEETING_STAGES.ADJOURNED]: 'Adjourned',
};

export default function TopBar({
    meetingState,
    currentUser,
    activeDrawer,
    onToggleDrawer,
    onLogout,
    onAbout,
}) {
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
                    Members<span className="drawer-toggle-count">{participantCount}</span>
                </button>
                <button
                    className={`drawer-toggle ${activeDrawer === 'queue' ? 'active' : ''}`}
                    onClick={() => onToggleDrawer('queue')}
                    aria-pressed={activeDrawer === 'queue'}
                >
                    Queue<span className="drawer-toggle-count">{queueCount}</span>
                </button>
                <button
                    className={`drawer-toggle ${activeDrawer === 'log' ? 'active' : ''}`}
                    onClick={() => onToggleDrawer('log')}
                    aria-pressed={activeDrawer === 'log'}
                >
                    Log<span className="drawer-toggle-count">{logCount}</span>
                </button>
                <button className="topbar-leave" onClick={onLogout}>
                    Leave
                </button>
            </div>
        </nav>
    );
}
