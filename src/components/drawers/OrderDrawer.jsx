import React from 'react';
import { useTranslation } from 'react-i18next';
import { MEETING_STAGES } from '../../constants';
import DrawerOverlay from '../DrawerOverlay';

export default function OrderDrawer({ meetingState, onClose }) {
    const { t } = useTranslation('meeting');

    const customAgendaItems = meetingState.meetingSettings?.agendaItems || [];
    const includeMinutesApproval = !!meetingState.meetingSettings?.includeMinutesApproval;
    const hasCustomAgenda = customAgendaItems.length > 0;
    const hasFormalAgenda = meetingState.meetingSettings?.agendaStatus === 'orders_of_the_day' && hasCustomAgenda;

    const requiredPrefixItems = [
        { id: 'call_to_order', title: t('topbar_stage_call_to_order') },
        { id: 'roll_call', title: t('topbar_stage_roll_call') },
        ...(includeMinutesApproval ? [{ id: 'approve_minutes', title: t('topbar_stage_approve_minutes') }] : [])
    ];
    const customSequenceItems = customAgendaItems.map((item) => ({ id: item.id, title: item.title }));
    const orderItems = [
        ...requiredPrefixItems,
        ...(hasFormalAgenda ? [{ id: 'adopt_agenda', title: t('topbar_stage_adopt_agenda') }] : []),
        ...customSequenceItems,
        { id: 'new_business', title: t('topbar_stage_new_business') }
    ];

    const minutesIndex = includeMinutesApproval ? 2 : null;
    const isAgendaPhase = meetingState.stage === MEETING_STAGES.ADOPT_AGENDA || meetingState.stage === MEETING_STAGES.AGENDA_ITEM;
    const customStartIndex = requiredPrefixItems.length + (hasFormalAgenda ? 1 : 0);
    const currentOrderIndex = hasCustomAgenda
        ? (
            meetingState.stage === MEETING_STAGES.NOT_STARTED ? 0 :
            meetingState.stage === MEETING_STAGES.CALL_TO_ORDER ? 0 :
            meetingState.stage === MEETING_STAGES.ROLL_CALL ? 1 :
            meetingState.stage === MEETING_STAGES.APPROVE_MINUTES && minutesIndex != null ? minutesIndex :
            meetingState.stage === MEETING_STAGES.ADOPT_AGENDA && hasFormalAgenda ? requiredPrefixItems.length :
            isAgendaPhase ? customStartIndex + (meetingState.currentAgendaIndex ?? 0) :
            meetingState.stage === MEETING_STAGES.ADJOURNED ? null :
            orderItems.length - 1
        )
        : (
            meetingState.stage === MEETING_STAGES.ADJOURNED ? null :
            meetingState.stage === MEETING_STAGES.NOT_STARTED || meetingState.stage === MEETING_STAGES.CALL_TO_ORDER ? 0 :
            meetingState.stage === MEETING_STAGES.ROLL_CALL ? 1 :
            meetingState.stage === MEETING_STAGES.APPROVE_MINUTES && minutesIndex != null ? minutesIndex :
            orderItems.length - 1
        );

    const currentItem = currentOrderIndex != null ? orderItems[currentOrderIndex] : null;
    const nextItem = currentOrderIndex != null ? orderItems[currentOrderIndex + 1] : null;

    return (
        <DrawerOverlay title={t('topbar_order_panel_title')} onClose={onClose}>
            <div className="topbar-order-summary" style={{ marginBottom: '0.9rem' }}>
                <div>
                    <strong>{t('topbar_order_current')}</strong>{' '}
                    {currentItem ? currentItem.title : t('topbar_order_complete')}
                </div>
                <div>
                    <strong>{t('topbar_order_next')}</strong>{' '}
                    {nextItem ? nextItem.title : t('topbar_order_none_short')}
                </div>
            </div>

            <ol className="topbar-order-list" style={{ maxHeight: 'none' }}>
                {orderItems.map((item, idx) => {
                    const itemState = currentOrderIndex == null
                        ? 'done'
                        : idx < currentOrderIndex
                            ? 'done'
                            : idx === currentOrderIndex
                                ? 'current'
                                : idx === currentOrderIndex + 1
                                    ? 'next'
                                    : 'upcoming';
                    return (
                        <li key={item.id || idx} className={`topbar-order-item ${itemState}`}>
                            <span className="topbar-order-index">{idx + 1}</span>
                            <div className="topbar-order-item-main">
                                <div className="topbar-order-item-title">{item.title}</div>
                            </div>
                            <span className="topbar-order-state">
                                {itemState === 'done' && t('topbar_order_state_done')}
                                {itemState === 'current' && t('topbar_order_state_current')}
                                {itemState === 'next' && t('topbar_order_state_next')}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </DrawerOverlay>
    );
}
