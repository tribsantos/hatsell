import i18n from '../i18n';

export const AGENDA_CATEGORIES = [
    { value: 'informational_report', label: 'Informational / Report' },
    { value: 'general_business', label: 'General Business (Main Motion)' },
    { value: 'rescind_amend', label: 'Rescind / Amend Something Previously Adopted' },
    { value: 'bylaw_amendments', label: 'Bylaw Amendments' },
    { value: 'election', label: 'Election' },
    { value: 'disciplinary', label: 'Formal Disciplinary Procedure' },
    { value: 'financial', label: 'Financial Matters (Budget / Dues / Assessments)' }
];

const CATEGORY_KEYS = {
    informational_report: 'agenda_cat_informational_report',
    general_business: 'agenda_cat_general_business',
    rescind_amend: 'agenda_cat_rescind_amend',
    bylaw_amendments: 'agenda_cat_bylaw_amendments',
    election: 'agenda_cat_election',
    disciplinary: 'agenda_cat_disciplinary',
    financial: 'agenda_cat_financial'
};

export function getCategoryLabel(category) {
    const key = CATEGORY_KEYS[category];
    if (key) {
        return i18n.t(`meeting:${key}`);
    }
    const found = AGENDA_CATEGORIES.find(c => c.value === category);
    return found ? found.label : category;
}
