export const specialOriginalOptions = [
    { key: 'special_bylaws', requiresNotice: 'bylawAmendments' },
    { key: 'special_standing_rules' },
    { key: 'special_rescind', requiresNotice: 'rescind' },
    { key: 'special_discharge', requiresNotice: 'dischargeCommittee' },
    { key: 'special_disciplinary', requiresNotice: 'disciplinary' }
];

export const incidentalMainOptions = [
    { key: 'incidental_main_committee' },
    { key: 'incidental_main_instructions' },
    { key: 'incidental_main_agenda' },
    { key: 'incidental_main_authorize' },
    { key: 'incidental_main_other' }
];

export const incidentalOptions = [
    { type: 'point_of_order', interrupts: true },
    { type: 'appeal', interrupts: true },
    { type: 'parliamentary_inquiry', interrupts: true },
    { type: 'request_for_info', interrupts: true },
    { type: 'division_of_assembly', interrupts: true },
    { type: 'division_of_question', interrupts: false },
    { type: 'objection_to_consideration', interrupts: true },
    { type: 'suspend_rules', interrupts: false }
];
