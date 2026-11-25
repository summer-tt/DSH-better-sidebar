/**
 * The one size constant both halves need, kept dependency-free on purpose.
 *
 * This replaces the retired `readLimit` deployment knob (`config.ts`). The old
 * cap answered "how many bytes may the host hand the client" by truncating the
 * document — which produced an editor that could neither be trusted nor saved
 * (issue #732: saving a partial document destroys the tail). Transfer size is
 * no longer a thing this plugin limits at all: upload, download, the HTML
 * preview route and the archive route all stream, so a 10 GB file is simply a
 * 10 GB file.
 *
 * What is still bounded is what an EDITOR can hold. CodeMirror keeps the whole
 * document in the browser, so a file above this size gets a read-only paged
 * preview (see `paged-text.tsx` / `jsonl-preview.tsx`) instead of an edit
 * buffer. VS Code draws the same line at a different number — its
 * `getLargeFileConfirmationLimit()` is 50 MB on the web build — and the shape
 * of the answer (threshold → degraded read-only view) is deliberately the same.
 *
 * Imported by BOTH halves, so this module must stay free of node builtins and
 * of anything that reaches them.
 */
/**
 * Text files at or below this size load whole and are editable; anything above
 * gets the read-only paged preview.
 */
export declare const MAX_EDITABLE_BYTES: number;
/**
 * Why a read refused to hand a document to the editor at all.
 *
 * - `size` — the file is above {@link MAX_EDITABLE_BYTES};
 * - `line` — the document's head contains one line at or above
 *   {@link MAX_EDITABLE_LINE_CHARS} (a minified single-line file, #1165).
 *
 * The client shows a different notice per reason, so "too large" and "one line
 * too long" do not have to pretend to be the same fact.
 */
export type EditLimitReason = 'size' | 'line';
/**
 * Longest single line the editor will accept into a CodeMirror document.
 *
 * CodeMirror virtualizes by LINE: a document whose one line is a few hundred
 * KB is parsed, tokenized (syntax highlighting) and laid out in a single frame,
 * and the renderer hangs — the only recovery is restarting the process (#1165:
 * a 327 KB minified HTML file, i.e. far below {@link MAX_EDITABLE_BYTES}).
 * The diff renderer already bounds its own rows at 20 K chars
 * (`MAX_RENDERED_LINE_CHARS` in `src/client/diff/DiffRows.tsx`); this is the
 * editor-side twin of that line.
 */
export declare const MAX_EDITABLE_LINE_CHARS = 20000;
/**
 * How much of a document's head {@link hasOverlongLine} inspects.
 *
 * The probe has to stay cheap, and the files it guards against are single-line
 * artifacts (minified HTML / JS / JSON) whose long line STARTS at byte zero, so
 * the head is where the evidence is. A long line that only appears past this
 * window is not detected — a deliberate bound, not an oversight.
 */
export declare const LINE_PROBE_CHARS: number;
/**
 * Whether a document must stay out of the edit buffer because one of its lines
 * is too long for CodeMirror.
 *
 * Only the first {@link LINE_PROBE_CHARS} characters are examined (see the
 * constant). A line cut off by that window counts by the part inside it.
 * `\r\n` counts as one separator; a lone `\r` is not an EOL for this editor
 * either (see `text-encoding.ts`), so it is treated as part of the line.
 *
 * @param text - the decoded document (the host calls this on the bytes it is
 *   about to hand the client, never on the client itself).
 * @returns true when some line inside the probe window reaches
 *   {@link MAX_EDITABLE_LINE_CHARS} characters.
 */
export declare function hasOverlongLine(text: string): boolean;
/**
 * Bytes one `fs.readPage` request returns. Pages are trimmed back to the last
 * newline so a page is normally a whole number of lines (and therefore, for
 * JSONL, a whole number of records); a single line longer than this is
 * returned untrimmed and stitched back together by the client.
 *
 * Sized so that even a file of very short lines lands in the low thousands of
 * rendered rows per page — the preview renders a page's rows as plain elements,
 * and the page size is the only thing bounding that.
 */
export declare const PAGE_BYTES: number;
/**
 * Hard ceiling on one editor save request body.
 *
 * This is a SERVER-SIDE SANITY GUARD, not a product limit: the editor cannot
 * produce more than {@link MAX_EDITABLE_BYTES} of text, so the UI can never
 * reach it. It exists because the save route receives a raw body and the
 * encoding transform (`restoreEol` + `encodeText`) needs the whole document as
 * a string.
 */
export declare const WRITE_BODY_GUARD_BYTES: number;
/**
 * Format a byte count for the "this file is too large to edit" notice. Kept
 * here beside the constant so the host and the client round identically.
 *
 * @param bytes - the file's size.
 * @returns e.g. `12.4 MB`, `512 KB`, `900 B`.
 */
export declare function formatByteSize(bytes: number): string;
/**
 * The human-facing form of {@link MAX_EDITABLE_BYTES}, for copy that names the
 * editing threshold.
 */
export declare const MAX_EDITABLE_LABEL = "5 MB";
