/**
 * amendmentDiff.js — Word-level diff and RONR amendment language generation.
 *
 * computeWordDiff(original, proposed)   → [{ type, word }]
 * generateAmendmentLanguage(original, proposed) → string | null
 * isPunctuation(token) → boolean
 */

const PUNCTUATION_NAMES = {
    '.': 'period',
    ',': 'comma',
    ';': 'semicolon',
    ':': 'colon',
    '!': 'exclamation point',
    '?': 'question mark',
};

export function isPunctuation(token) {
    return PUNCTUATION_NAMES.hasOwnProperty(token);
}

function punctuationName(token) {
    return PUNCTUATION_NAMES[token] || token;
}

function punctuationArticle(token) {
    const name = punctuationName(token);
    return /^[aeiou]/i.test(name) ? 'an' : 'a';
}

/**
 * Rejoin tokens for natural quoting: attach punctuation to preceding word.
 * ["in", "the", "galaxy", "."] → "in the galaxy."
 */
function rejoinForQuote(tokens) {
    let result = '';
    for (const t of tokens) {
        if (isPunctuation(t) && result.length > 0) {
            result += t;
        } else {
            if (result.length > 0) result += ' ';
            result += t;
        }
    }
    return result;
}

/**
 * Tokenize text into words, splitting trailing punctuation into separate tokens.
 * "history." → ["history", "."]
 */
function tokenize(text) {
    const raw = (text || '').trim().split(/\s+/).filter(Boolean);
    const tokens = [];
    for (const word of raw) {
        const match = word.match(/^(.+?)([.,;:!?])$/);
        if (match && /[a-zA-Z0-9]/.test(match[1])) {
            tokens.push(match[1]);
            tokens.push(match[2]);
        } else {
            tokens.push(word);
        }
    }
    return tokens;
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

    // Substitution threshold: >60% of original *words* (not punctuation) changed
    const origWords = tokenize(originalText).filter(t => !isPunctuation(t));
    const deletedWordCount = ops.filter(o => o.type === 'delete' && !isPunctuation(o.word)).length;

    if (origWords.length > 0 && deletedWordCount / origWords.length > 0.6) {
        return `I move to amend by substituting the following: "${rejoinForQuote(tokenize(proposedText))}"`;
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
                // Gather up to 3 preceding non-punctuation keep-words as context
                const contextBefore = [];
                for (let k = idx - 1; k >= 0 && contextBefore.length < 3; k--) {
                    if (ops[k].type === 'keep') {
                        if (!isPunctuation(ops[k].word)) {
                            contextBefore.unshift(ops[k].word);
                        }
                    } else break;
                }
                // Gather up to 3 following non-punctuation keep-words as context
                const contextAfter = [];
                for (let k = idx + 1; k < ops.length && contextAfter.length < 3; k++) {
                    if (ops[k].type === 'keep') {
                        if (!isPunctuation(ops[k].word)) {
                            contextAfter.push(ops[k].word);
                        }
                    } else if (ops[k].type !== 'keep') {
                        continue;
                    }
                }
                current = { deleted: [], inserted: [], contextBefore, contextAfter };
            }
            if (op.type === 'delete') current.deleted.push(op.word);
            if (op.type === 'insert') current.inserted.push(op.word);
        }
    }
    if (current) blocks.push(current);

    if (blocks.length === 0) return null;

    const clauses = blocks.map(block => {
        const { deleted, inserted, contextBefore, contextAfter } = block;

        const hasPunct = deleted.some(isPunctuation) || inserted.some(isPunctuation);

        if (!hasPunct) {
            // Word-only logic (no punctuation involved)
            const hasDel = deleted.length > 0;
            const hasIns = inserted.length > 0;

            if (hasIns && !hasDel) {
                if (contextBefore.length > 0) {
                    return `adding '${inserted.join(' ')}' after the words '${contextBefore.join(' ')}'`;
                } else if (contextAfter.length > 0) {
                    return `adding '${inserted.join(' ')}' before the words '${contextAfter.join(' ')}'`;
                }
                return `adding '${inserted.join(' ')}'`;
            }

            if (hasDel && !hasIns) {
                return `striking '${deleted.join(' ')}'`;
            }

            return `striking '${deleted.join(' ')}' and inserting '${inserted.join(' ')}'`;
        }

        // Punctuation-aware logic
        const delPunct = deleted.filter(isPunctuation);
        const delWords = deleted.filter(t => !isPunctuation(t));

        // Split inserted into leading punctuation and body
        let insLeadingPunct = [];
        let insBodyStart = 0;
        for (let k = 0; k < inserted.length; k++) {
            if (isPunctuation(inserted[k])) {
                insLeadingPunct.push(inserted[k]);
                insBodyStart = k + 1;
            } else break;
        }
        const insBody = inserted.slice(insBodyStart);
        const insHasWords = insBody.some(t => !isPunctuation(t));

        const parts = [];
        const lastContextWord = contextBefore.length > 0 ? contextBefore[contextBefore.length - 1] : null;

        // Deleted punctuation
        for (const p of delPunct) {
            if (lastContextWord) {
                parts.push(`striking the ${punctuationName(p)} after '${lastContextWord}'`);
            } else {
                parts.push(`striking the ${punctuationName(p)}`);
            }
        }

        // Deleted words
        if (delWords.length > 0) {
            parts.push(`striking '${delWords.join(' ')}'`);
        }

        // Inserted leading punctuation
        for (const p of insLeadingPunct) {
            if (lastContextWord) {
                parts.push(`inserting ${punctuationArticle(p)} ${punctuationName(p)} after '${lastContextWord}'`);
            } else {
                parts.push(`inserting ${punctuationArticle(p)} ${punctuationName(p)}`);
            }
        }

        // Inserted body (words + any trailing punctuation, rejoined for quoting)
        if (insBody.length > 0 && insHasWords) {
            const quoted = rejoinForQuote(insBody);
            if (insLeadingPunct.length > 0) {
                parts.push(`followed by '${quoted}'`);
            } else if (delWords.length > 0 || delPunct.length > 0) {
                parts.push(`inserting '${quoted}'`);
            } else if (contextBefore.length > 0) {
                parts.push(`adding '${quoted}' after the words '${contextBefore.join(' ')}'`);
            } else if (contextAfter.length > 0) {
                parts.push(`adding '${quoted}' before the words '${contextAfter.join(' ')}'`);
            } else {
                parts.push(`adding '${quoted}'`);
            }
        } else if (insBody.length > 0 && !insHasWords) {
            // Body is only trailing punctuation
            for (const p of insBody.filter(isPunctuation)) {
                parts.push(`inserting ${punctuationArticle(p)} ${punctuationName(p)}`);
            }
        }

        return parts.join(', ');
    });

    const body = clauses.join('; and ');
    return `I move to amend by ${body}`;
}
