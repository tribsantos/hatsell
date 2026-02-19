export const AGENDA_CATEGORIES = [
    { value: 'informational_report', label: 'Informational / Report' },
    { value: 'general_business', label: 'General Business (Main Motion)' },
    { value: 'rescind_amend', label: 'Rescind / Amend Something Previously Adopted' },
    { value: 'bylaw_amendments', label: 'Bylaw Amendments' },
    { value: 'election', label: 'Election' },
    { value: 'disciplinary', label: 'Formal Disciplinary Procedure' },
    { value: 'financial', label: 'Financial Matters (Budget / Dues / Assessments)' }
];

export function getCategoryLabel(category) {
    const found = AGENDA_CATEGORIES.find(c => c.value === category);
    return found ? found.label : category;
}
