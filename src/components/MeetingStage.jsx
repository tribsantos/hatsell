import React from 'react';
import { MEETING_STAGES } from '../constants';

export default function MeetingStage({ stage, currentMotion, motionStack, suspendedRulesPurpose }) {
    const top = motionStack && motionStack.length > 0 ? motionStack[motionStack.length - 1] : null;

    const stageInfo = {
        [MEETING_STAGES.NOT_STARTED]: {
            title: 'Meeting Not Started',
            description: 'Waiting for chair to call meeting to order'
        },
        [MEETING_STAGES.CALL_TO_ORDER]: {
            title: 'Call to Order',
            description: 'The chair will call the meeting to order'
        },
        [MEETING_STAGES.ROLL_CALL]: {
            title: 'Roll Call',
            description: 'Establishing quorum'
        },
        [MEETING_STAGES.APPROVE_MINUTES]: {
            title: 'Approve Minutes',
            description: 'Review and approve minutes from previous meeting'
        },
        [MEETING_STAGES.NEW_BUSINESS]: {
            title: top ? `${top.displayName} - Pending Second` : (currentMotion ? 'Motion Pending Second' : 'New Business'),
            description: top
                ? `${top.displayName} requires a second to proceed`
                : (currentMotion ? 'Motion requires a second to proceed' : 'Members may introduce new motions')
        },
        [MEETING_STAGES.MOTION_DISCUSSION]: {
            title: top ? `Discussion: ${top.displayName}` : 'Discussion',
            description: top
                ? `Debating: "${top.text.substring(0, 80)}${top.text.length > 80 ? '...' : ''}"`
                : 'Members debate the motion on the floor'
        },
        [MEETING_STAGES.VOTING]: {
            title: top ? `Voting: ${top.displayName}` : 'Voting in Progress',
            description: 'Members cast their votes'
        },
        [MEETING_STAGES.RECESS]: {
            title: 'Meeting in Recess',
            description: 'The meeting is temporarily recessed'
        },
        [MEETING_STAGES.SUSPENDED_RULES]: {
            title: 'RULES SUSPENDED',
            description: suspendedRulesPurpose || 'Rules have been suspended'
        },
        [MEETING_STAGES.ADJOURNED]: {
            title: 'Meeting Adjourned',
            description: 'Meeting has concluded'
        }
    };

    const info = stageInfo[stage] || stageInfo[MEETING_STAGES.NOT_STARTED];

    return (
        <div className="meeting-stage" aria-live="polite">
            <h2>{info.title}</h2>
            <p className="stage-description">{info.description}</p>
            {motionStack && motionStack.length > 1 && (
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {motionStack.length} motions on the stack
                </p>
            )}
        </div>
    );
}
