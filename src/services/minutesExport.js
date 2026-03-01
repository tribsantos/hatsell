import {
    Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
    BorderStyle, TabStopType, TabStopPosition
} from 'docx';
import { MOTION_TYPES } from '../constants/motionTypes';
import i18n from '../i18n';

/**
 * Export meeting minutes in RONR 12th ed. §48 format as a .docx file.
 */
export async function exportMinutes(meetingState) {
    const log = meetingState.log || [];
    const participants = meetingState.participants || [];
    const decidedMotions = meetingState.decidedMotions || [];
    const tabledMotions = meetingState.tabledMotions || [];

    const language = meetingState?.meetingSettings?.language || i18n.language || 'en';
    const locale = language === 'pt-BR' ? 'pt-BR' : 'en-US';
    const t = (key, opts) => i18n.t(`meeting:${key}`, opts);

    const meetingDate = new Date().toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Extract times from log
    const callToOrderMarkers = [
        i18n.t('meeting:log_called_to_order', { lng: 'en' }),
        i18n.t('meeting:log_called_to_order', { lng: 'pt-BR' })
    ];
    const adjournMarkers = [
        i18n.t('meeting:log_meeting_adjourned', { lng: 'en' }),
        i18n.t('meeting:log_meeting_adjourned', { lng: 'pt-BR' })
    ];
    const callToOrderEntry = log.find((e) => callToOrderMarkers.some((marker) => e.message.includes(marker)));
    const adjournEntry = [...log].reverse().find(e =>
        adjournMarkers.some((marker) => e.message.includes(marker))
    );

    const callToOrderTime = callToOrderEntry?.timestamp || 'N/A';
    const adjournTime = adjournEntry?.timestamp || 'N/A';

    // Build participants info
    const chair = participants.find(p => p.role === 'Chair' || p.role === 'President/Chair');
    const secretary = participants.find(p => p.role === 'Secretary');

    const sections = [];

    // === HEADING ===
    sections.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({ text: meetingState.meetingSettings?.meetingName
                    ? t('minutes_export_title_with_name', { name: meetingState.meetingSettings.meetingName.toUpperCase() })
                    : t('minutes_export_title_default'), bold: true, size: 32 })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun(meetingState.orgProfile?.organizationName
                    ? { text: meetingState.orgProfile.organizationName, size: 24 }
                    : { text: '[Organization Name]', italics: true, size: 24, color: '888888' })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
                new TextRun({ text: meetingDate, size: 24 })
            ]
        })
    );

    // === CALL TO ORDER ===
    sections.push(
        new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
                new TextRun({ text: t('minutes_export_call_to_order_heading'), bold: true })
            ]
        }),
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({ text: chair
                    ? t('minutes_export_call_to_order_text_with_chair', { time: callToOrderTime, name: chair.name })
                    : t('minutes_export_call_to_order_text_no_chair', { time: callToOrderTime }) })
            ]
        })
    );

    // === ATTENDANCE ===
    sections.push(
        new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
                new TextRun({ text: t('minutes_export_attendance_heading'), bold: true })
            ]
        })
    );

    const rollCallEntry = log.find(e => e.message.includes('Roll call complete'));
    if (rollCallEntry) {
        sections.push(
            new Paragraph({
                spacing: { after: 100 },
                children: [
                    new TextRun({ text: rollCallEntry.message })
                ]
            })
        );
    }

    // Build full attendance from current participants + log entries (people who left early)
    const allAttendees = new Map();
    participants.forEach(p => allAttendees.set(p.name, p.role));
    log.forEach(e => {
        const joinMatch = e.message.match(/^(.+) joined as (.+)$/);
        if (joinMatch) {
            const [, name, role] = joinMatch;
            if (!allAttendees.has(name)) allAttendees.set(name, role);
        }
    });
    // Also include the chair from the "Meeting created by" log entry
    const createdEntry = log.find(e => e.message.includes('Meeting created by'));
    if (createdEntry && chair) {
        allAttendees.set(chair.name, chair.role);
    }

    sections.push(
        new Paragraph({
            spacing: { after: 100 },
            children: [
                new TextRun({ text: t('minutes_export_present_members'), bold: true })
            ]
        })
    );

    allAttendees.forEach((role, name) => {
        sections.push(
            new Paragraph({
                spacing: { after: 40 },
                indent: { left: 720 },
                children: [
                    new TextRun({ text: name }),
                    new TextRun({ text: ` (${role})`, italics: true, color: '666666' })
                ]
            })
        );
    });

    if (meetingState.quorum) {
        sections.push(
            new Paragraph({
                spacing: { before: 100, after: 200 },
                children: [
                    new TextRun({ text: t('minutes_export_quorum', { count: meetingState.quorum }) })
                ]
            })
        );
    }

    // === APPROVAL OF MINUTES ===
    const minutesApprovedEntry = log.find(e => e.message.includes('Minutes approved'));
    if (minutesApprovedEntry) {
        sections.push(
            new Paragraph({
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
                children: [
                    new TextRun({ text: t('minutes_export_approval_heading'), bold: true })
                ]
            }),
            new Paragraph({
                spacing: { after: 200 },
                children: [
                    new TextRun({ text: t('minutes_export_approval_text') })
                ]
            })
        );
    }

    // === MOTIONS ===
    if (decidedMotions.length > 0 || tabledMotions.length > 0) {
        sections.push(
            new Paragraph({
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
                children: [
                    new TextRun({ text: t('minutes_export_motions_heading'), bold: true })
                ]
            })
        );

        decidedMotions.forEach((motion, idx) => {
            const isAdopted = motion.result === 'adopted';
            const result = isAdopted ? t('minutes_export_adopted') : t('minutes_export_defeated');
            const votes = motion.votes || {};
            const isAmendment = motion.motionType === MOTION_TYPES.AMEND;
            const amendedText = motion.metadata?.proposedText;
            const hasAmendedTextLine = isAmendment && amendedText;

            sections.push(
                new Paragraph({
                    spacing: { before: 150, after: 60 },
                    children: [
                        new TextRun({ text: `${idx + 1}. `, bold: true }),
                        new TextRun({ text: `${motion.displayName || t('minutes_export_motion_fallback')}`, bold: true }),
                        new TextRun({ text: ` \u2014 ${result}`, bold: true, color: isAdopted ? '1e8449' : 'c0392b' })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 40 },
                    indent: { left: 360 },
                    children: [
                        ...(isAmendment
                            ? [new TextRun({ text: t('minutes_export_amendment_proposal'), bold: true }), new TextRun({ text: `"${motion.text}"` })]
                            : [new TextRun({ text: `"${motion.text}"` })]
                        )
                    ]
                }),
                ...(hasAmendedTextLine ? [new Paragraph({
                    spacing: { after: 40 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({ text: t('minutes_export_amended_text'), bold: true }),
                        new TextRun({ text: `"${amendedText}"` })
                    ]
                })] : []),
                new Paragraph({
                    spacing: { after: 40 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({ text: t('minutes_export_moved_by'), bold: true }),
                        new TextRun({ text: motion.mover || 'N/A' }),
                        ...(motion.seconder ? [
                            new TextRun({ text: t('minutes_export_seconded_by'), bold: true }),
                            new TextRun({ text: motion.seconder })
                        ] : [])
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({ text: t('minutes_export_vote_label'), bold: true }),
                        new TextRun({
                            text: `${votes.aye || 0} ayes, ${votes.nay || 0} nays, ${votes.abstain || 0} abstentions`
                        }),
                        ...(motion.voteRequired ? [
                            new TextRun({ text: ` (${motion.voteRequired.replace('_', '-')}${t('minutes_export_required_suffix')})`, italics: true })
                        ] : [])
                    ]
                })
            );
        });

        tabledMotions.forEach((tabled) => {
            sections.push(
                new Paragraph({
                    spacing: { before: 150, after: 100 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({ text: t('minutes_export_tabled_label'), bold: true, color: 'e67e22' }),
                        new TextRun({ text: `"${tabled.mainMotionText}"` })
                    ]
                })
            );
        });
    }

    // === ADJOURNMENT ===
    sections.push(
        new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
                new TextRun({ text: t('minutes_export_adjournment_heading'), bold: true })
            ]
        }),
        new Paragraph({
            spacing: { after: 400 },
            children: [
                new TextRun({ text: t('minutes_export_adjournment_text', { time: adjournTime }) })
            ]
        })
    );

    // === SIGNATURE LINE ===
    sections.push(
        new Paragraph({
            spacing: { before: 600 },
            children: [
                new TextRun({ text: '________________________________________' })
            ]
        }),
        new Paragraph({
            spacing: { after: 40 },
            children: [
                new TextRun({
                    text: secretary ? secretary.name : '[Secretary Name]',
                    italics: !secretary
                }),
                new TextRun({ text: t('minutes_export_secretary_suffix') })
            ]
        })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: sections
        }]
    });

    const blob = await Packer.toBlob(doc);

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minutes-${new Date().toISOString().split('T')[0]}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
