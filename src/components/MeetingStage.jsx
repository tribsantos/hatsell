import React from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES } from '../constants';

export default function MeetingStage({ stage, currentMotion, motionStack, suspendedRulesPurpose, agendaItems, currentAgendaIndex }) {
    const { t } = useTranslation('meeting');
    const top = motionStack && motionStack.length > 0 ? motionStack[motionStack.length - 1] : null;

    const stageInfo = {
        [MEETING_STAGES.NOT_STARTED]: {
            title: t('stage_not_started_title'),
            description: t('stage_not_started_desc'),
            subtitle: t('stage_not_started_subtitle')
        },
        [MEETING_STAGES.CALL_TO_ORDER]: {
            title: t('stage_call_to_order_title'),
            description: t('stage_call_to_order_desc')
        },
        [MEETING_STAGES.ROLL_CALL]: {
            title: t('stage_roll_call_title'),
            description: t('stage_roll_call_desc')
        },
        [MEETING_STAGES.APPROVE_MINUTES]: {
            title: t('stage_approve_minutes_title'),
            description: t('stage_approve_minutes_desc'),
            subtitle: t('stage_approve_minutes_subtitle')
        },
        [MEETING_STAGES.ADOPT_AGENDA]: {
            title: t('stage_adopt_agenda_title'),
            description: t('stage_adopt_agenda_desc')
        },
        [MEETING_STAGES.AGENDA_ITEM]: (() => {
            const items = agendaItems || [];
            const idx = currentAgendaIndex ?? 0;
            const item = items[idx];
            return {
                title: item ? t('stage_agenda_item_title', { index: idx + 1, title: item.title }) : t('stage_agenda_item_title_default'),
                description: item ? t('stage_agenda_item_desc', { current: idx + 1, total: items.length }) : t('stage_agenda_item_desc_default')
            };
        })(),
        [MEETING_STAGES.NEW_BUSINESS]: {
            title: top ? t('stage_pending_second_title', { motionName: top.displayName }) : (currentMotion ? t('stage_motion_pending_second') : t('stage_new_business_title')),
            description: top
                ? t('stage_pending_second_desc', { motionName: top.displayName })
                : (currentMotion ? t('stage_motion_pending_second_desc') : t('stage_new_business_desc')),
            subtitle: top ? t('stage_pending_second_subtitle') : null
        },
        [MEETING_STAGES.MOTION_DISCUSSION]: {
            title: top ? t('stage_discussion_title', { motionName: top.displayName }) : t('stage_discussion_default'),
            description: top
                ? t('stage_discussion_desc', { text: top.text.substring(0, 80) + (top.text.length > 80 ? '...' : '') })
                : t('stage_discussion_desc_default')
        },
        [MEETING_STAGES.VOTING]: {
            title: top ? t('stage_voting_title', { motionName: top.displayName }) : t('stage_voting_default'),
            description: t('stage_voting_desc')
        },
        [MEETING_STAGES.RECESS]: {
            title: t('stage_recess_title'),
            description: t('stage_recess_desc'),
            subtitle: t('stage_recess_subtitle')
        },
        [MEETING_STAGES.SUSPENDED_RULES]: {
            title: t('stage_suspended_rules_title'),
            description: suspendedRulesPurpose || t('stage_suspended_rules_desc_default'),
            subtitle: t('stage_suspended_rules_subtitle')
        },
        [MEETING_STAGES.ADJOURNED]: {
            title: t('stage_adjourned_title'),
            description: t('stage_adjourned_desc'),
            subtitle: t('stage_adjourned_subtitle')
        }
    };

    const info = stageInfo[stage] || stageInfo[MEETING_STAGES.NOT_STARTED];

    return (
        <section className="meeting-stage" aria-live="polite" aria-label="Current meeting stage">
            <h2>{info.title}</h2>
            <p className="stage-description">{info.description}</p>
            {info.subtitle && (
                <p className="stage-subtitle">{info.subtitle}</p>
            )}
            {motionStack && motionStack.length > 1 && (
                <p className="stage-description" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {t('motions_on_stack', { count: motionStack.length })}
                </p>
            )}
        </section>
    );
}
