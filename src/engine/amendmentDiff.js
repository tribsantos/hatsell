/**
 * amendmentDiff.js — Word-level diff and RONR amendment language generation.
 *
 * computeWordDiff(original, proposed)   → [{ type, word }]
 * generateAmendmentLanguage(original, proposed) → string | null
 */

function tokenize(text) {
    return (text || '').trim().split(/\s+/).filter(Boolean);
}

/**
 * LCS-based word diff.
 * Returns flat array of { type: 'keep'|'delete'|'insert', word }.
 */
export function computeWordDiff(originalText, proposedText) {
    const a = tokenize(originalText);
    const b = tokenize(proposedText);

    if (a.length === 0 && b.length === 0) return [];
    if (a.length === 0) return b.map(w => ({ type: 'insert', word: w }));
    if (b.length === 0) return a.map(w => ({ type: 'delete', word: w }));

    // Build LCS table
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to produce ops
    const ops = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
            ops.push({ type: 'keep', word: a[i - 1] });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            ops.push({ type: 'insert', word: b[j - 1] });
            j--;
        } else {
            ops.push({ type: 'delete', word: a[i - 1] });
            i--;
        }
    }

    ops.reverse();
    return ops;
}

/**
 * Generate formal RONR amendment language from two texts.
 * Returns null if no substantive changes.
 */
export function generateAmendmentLanguage(originalText, proposedText) {
    const ops = computeWordDiff(originalText, proposedText);
    if (ops.length === 0) return null;

    const hasChange = ops.some(o => o.type !== 'keep');
    if (!hasChange) return null;

    const origWords = tokenize(originalText);
    const deletedCount = ops.filter(o => o.type === 'delete').length;

    // Substitution threshold: >60% of original words changed
    if (origWords.length > 0 && deletedCount / origWords.length > 0.6) {
        const proposedWords = tokenize(proposedText);
        return `I move to amend by substituting the following: "${proposedWords.join(' ')}"`;
    }

    // Group contiguous change blocks
    const blocks = [];
    let current = null;

    for (let idx = 0; idx < ops.length; idx++) {
        const op = ops[idx];
        if (op.type === 'keep') {
            if (current) {
                blocks.push(current);
                current = null;
            }
        } else {
            if (!current) {
                // Gather up to 3 preceding keep-words as context
                const contextBefore = [];
                for (let k = idx - 1; k >= 0 && contextBefore.length < 3; k--) {
                    if (ops[k].type === 'keep') {
                        contextBefore.unshift(ops[k].word);
                    } else break;
                }
                // Gather up to 3 following keep-words as context
                const contextAfter = [];
                for (let k = idx + 1; k < ops.length && contextAfter.length < 3; k++) {
                    if (ops[k].type === 'keep') {
                        contextAfter.push(ops[k].word);
                    } else if (ops[k].type !== 'keep') {
                        // Still part of this change block, keep scanning
                        continue;
                    }
                }
                current = { deleted: [], inserted: [], contextBefore, contextAfter, startIdx: idx };
            }
            if (op.type === 'delete') current.deleted.push(op.word);
            if (op.type === 'insert') current.inserted.push(op.word);
        }
    }
    if (current) blocks.push(current);

    if (blocks.length === 0) return null;

    const clauses = blocks.map(block => {
        const { deleted, inserted, contextBefore, contextAfter } = block;
        const hasDel = deleted.length > 0;
        const hasIns = inserted.length > 0;

        if (hasIns && !hasDel) {
            // Pure insertion
            if (contextBefore.length > 0) {
                return `adding '${inserted.join(' ')}' after the words '${contextBefore.join(' ')}'`;
            } else if (contextAfter.length > 0) {
                return `adding '${inserted.join(' ')}' before the words '${contextAfter.join(' ')}'`;
            }
            return `adding '${inserted.join(' ')}'`;
        }

        if (hasDel && !hasIns) {
            // Pure deletion
            return `striking '${deleted.join(' ')}'`;
        }

        // Both deletion and insertion (substitution within block)
        return `striking '${deleted.join(' ')}' and inserting '${inserted.join(' ')}'`;
    });

    const body = clauses.join('; and ');
    return `I move to amend by ${body}`;
}
