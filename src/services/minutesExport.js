import {
    Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
    BorderStyle, TabStopType, TabStopPosition
} from 'docx';

/**
 * Export meeting minutes in RONR 12th ed. §48 format as a .docx file.
 */
export async function exportMinutes(meetingState) {
    const log = meetingState.log || [];
    const participants = meetingState.participants || [];
    const decidedMotions = meetingState.decidedMotions || [];
    const tabledMotions = meetingState.tabledMotions || [];

    const meetingDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Extract times from log
    const callToOrderEntry = log.find(e => e.message.includes('called to order'));
    const adjournEntry = [...log].reverse().find(e =>
        e.message.includes('adjourned') || e.message.includes('Adjourned')
    );

    const callToOrderTime = callToOrderEntry?.timestamp || 'N/A';
    const adjournTime = adjournEntry?.timestamp || 'N/A';

    // Build participants info
    const chair = participants.find(p => p.role === 'President/Chair');
    const secretary = participants.find(p => p.role === 'Secretary');

    const sections = [];

    // === HEADING ===
    sections.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({ text: 'MINUTES OF MEETING', bold: true, size: 32 })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({ text: '[Organization Name]', italics: true, size: 24, color: '888888' })
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
                new TextRun({ text: 'Call to Order', bold: true })
            ]
        }),
        new Paragraph({
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: `The meeting was called to order at ${callToOrderTime}${chair ? ` by ${chair.name}, presiding.` : '.'}`
                })
            ]
        })
    );

    // === ATTENDANCE ===
    sections.push(
        new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
                new TextRun({ text: 'Attendance', bold: true })
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

    sections.push(
        new Paragraph({
            spacing: { after: 100 },
            children: [
                new TextRun({ text: 'Members present:', bold: true })
            ]
        })
    );

    participants.forEach(p => {
        sections.push(
            new Paragraph({
                spacing: { after: 40 },
                indent: { left: 720 },
                children: [
                    new TextRun({ text: `${p.name}` }),
                    new TextRun({ text: ` (${p.role})`, italics: true, color: '666666' })
                ]
            })
        );
    });

    if (meetingState.quorum) {
        sections.push(
            new Paragraph({
                spacing: { before: 100, after: 200 },
                children: [
                    new TextRun({ text: `Quorum: ${meetingState.quorum} members required.` })
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
                    new TextRun({ text: 'Approval of Minutes', bold: true })
                ]
            }),
            new Paragraph({
                spacing: { after: 200 },
                children: [
                    new TextRun({ text: 'The minutes of the previous meeting were approved.' })
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
                    new TextRun({ text: 'Motions', bold: true })
                ]
            })
        );

        decidedMotions.forEach((motion, idx) => {
            const result = motion.result === 'adopted' ? 'ADOPTED' : 'DEFEATED';
            const votes = motion.votes || {};

            sections.push(
                new Paragraph({
                    spacing: { before: 150, after: 60 },
                    children: [
                        new TextRun({ text: `${idx + 1}. `, bold: true }),
                        new TextRun({ text: `${motion.displayName || 'Motion'}`, bold: true }),
                        new TextRun({ text: ` \u2014 ${result}`, bold: true, color: result === 'ADOPTED' ? '1e8449' : 'c0392b' })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 40 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({ text: `"${motion.text}"` })
                    ]
                }),
                new Paragraph({
                    spacing: { after: 40 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({ text: 'Moved by: ', bold: true }),
                        new TextRun({ text: motion.mover || 'N/A' }),
                        ...(motion.seconder ? [
                            new TextRun({ text: '  |  Seconded by: ', bold: true }),
                            new TextRun({ text: motion.seconder })
                        ] : [])
                    ]
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({ text: 'Vote: ', bold: true }),
                        new TextRun({
                            text: `${votes.aye || 0} ayes, ${votes.nay || 0} nays, ${votes.abstain || 0} abstentions`
                        }),
                        ...(motion.voteRequired ? [
                            new TextRun({ text: ` (${motion.voteRequired.replace('_', '-')} required)`, italics: true })
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
                        new TextRun({ text: 'TABLED: ', bold: true, color: 'e67e22' }),
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
                new TextRun({ text: 'Adjournment', bold: true })
            ]
        }),
        new Paragraph({
            spacing: { after: 400 },
            children: [
                new TextRun({
                    text: `The meeting was adjourned at ${adjournTime}.`
                })
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
                new TextRun({ text: ', Secretary' })
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
