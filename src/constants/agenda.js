import i18n from '../i18n';

export const AGENDA_CATEGORIES = [
    { value: 'informational_report', label: 'Informational / Report' },
    { value: 'unfinished_business', label: 'Unfinished Business' },
    { value: 'general_business', label: 'General Business (Main Motion)' },
    { value: 'rescind_amend', label: 'Rescind / Amend Something Previously Adopted' },
    { value: 'bylaw_amendments', label: 'Bylaw Amendments' },
    { value: 'election', label: 'Election' },
    { value: 'disciplinary', label: 'Formal Disciplinary Procedure' },
    { value: 'financial', label: 'Financial Matters (Budget / Dues / Assessments)' }
];

const CATEGORY_KEYS = {
    informational_report: 'agenda_cat_informational_report',
    unfinished_business: 'agenda_cat_unfinished_business',
    general_business: 'agenda_cat_general_business',
    rescind_amend: 'agenda_cat_rescind_amend',
    bylaw_amendments: 'agenda_cat_bylaw_amendments',
    election: 'agenda_cat_election',
    disciplinary: 'agenda_cat_disciplinary',
    financial: 'agenda_cat_financial'
};

export const AGENDA_CATEGORY_DEFAULT_ORDER = [
    'informational_report',
    'unfinished_business',
    'general_business',
    'financial',
    'bylaw_amendments',
    'election',
    'rescind_amend',
    'disciplinary'
];

const CATEGORY_ORDER_INDEX = AGENDA_CATEGORY_DEFAULT_ORDER.reduce((acc, key, idx) => {
    acc[key] = idx;
    return acc;
}, {});

export function getCategoryLabel(category) {
    const key = CATEGORY_KEYS[category];
    if (key) {
        return i18n.t(`meeting:${key}`);
    }
    const found = AGENDA_CATEGORIES.find(c => c.value === category);
    return found ? found.label : category;
}

export function sortAgendaItemsByDefault(items) {
    const safeItems = Array.isArray(items) ? items : [];
    return [...safeItems].sort((a, b) => {
        const aOrder = CATEGORY_ORDER_INDEX[a.category] ?? 999;
        const bOrder = CATEGORY_ORDER_INDEX[b.category] ?? 999;
        if (aOrder !== bOrder) return aOrder - bOrder;

        const aTime = Number(a.createdAt || 0);
        const bTime = Number(b.createdAt || 0);
        if (aTime !== bTime) return aTime - bTime;

        return String(a.title || '').localeCompare(String(b.title || ''));
    });
}
