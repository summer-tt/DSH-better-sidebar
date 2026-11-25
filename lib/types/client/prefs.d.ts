/**
 * Client-side read of the user-facing "Side card" preferences. The host owns
 * the namespace through the settings seam (in-process); the DSH settings RPC
 * domain only serves allowlisted namespaces to configuration clients, so the
 * client reads and writes THIS namespace through the plugin's own fenced
 * /sidebar routes instead (api.settingsGet/settingsUpdate). Any failure
 * (route rejected, namespace absent, a field of the wrong type, a value out
 * of the contract range) falls back to the schema defaults — the side card
 * must keep working exactly as composed when the settings surface is missing.
 */
import type { api } from './api.ts';
import { EXPLORER_EXCLUDE_DEFAULTS, SIDEBAR_PREFS_DEFAULTS, type SidebarPrefs, type SidechatSubmitKey, type SidechatTabsMode } from '../prefs-shared.ts';
export { EXPLORER_EXCLUDE_DEFAULTS, SIDEBAR_PREFS_DEFAULTS, };
export type { SidebarPrefs };
/** The settings wire face the preferences need (a subset of the plugin api). */
export type SidebarSettingsClient = Pick<typeof api, 'settingsGet' | 'settingsUpdate'>;
/** Validate one raw resolved value into {@link SidebarPrefs}. Used for the
 * settings.get payload AND the settings.update response (both carry the
 * layered resolved value); any malformed field falls back to its default.
 * @param value - the raw resolved section from the settings wire.
 * @returns validated prefs (always well-formed).
 */
export declare function parsePrefs(value: unknown): SidebarPrefs;
/**
 * The side-chat composer's submission mode from the parsed preferences. The
 * value is the side-chat feature's own plugin-owned setting (see
 * `prefs-shared.ts`), so a document that never chose one reads the default.
 * @param prefs - the parsed side card preferences.
 * @returns the configured submit-key mode.
 */
export declare function sidechatSubmitKeyOf(prefs: SidebarPrefs): SidechatSubmitKey;
/**
 * The side-chat page mode: one shared native page (the default) or one page
 * per thread. The value is the feature's own plugin-owned setting, so a
 * document that never chose one reads the default.
 * @param prefs - the parsed side card preferences.
 * @returns the configured page mode.
 */
export declare function sidechatTabsModeOf(prefs: SidebarPrefs): SidechatTabsMode;
/**
 * Read the resolved side card preferences through the plugin's settings route.
 * @param settings - the settings wire face (the plugin api by default).
 * @returns validated prefs, or the schema defaults when the route rejects,
 * the namespace is absent, or a stored value violates the contract.
 */
export declare function loadPrefs(settings: SidebarSettingsClient): Promise<SidebarPrefs>;
/**
 * Read the external-disable flag from the same settings route: the
 * dsh-web-ui family's aionui-panel provider choice. True only when the host
 * resolved `aionui-panel.rightPanel` to 'aionui-panel' — while true the
 * sidebar must not mount (the two right panels are mutually exclusive). Any
 * failure (route rejected, aionui absent, malformed response) reads false,
 * so a missing family never hides the sidebar.
 * @param settings - the settings wire face (the plugin api by default).
 * @returns the external-disable flag (false on any failure).
 */
export declare function loadExternalDisable(settings: SidebarSettingsClient): Promise<boolean>;
/** The boot decision both the prefs and the external-disable flag need:
 *  ONE settings fetch answers both (the boot path used to await
 *  {@link loadPrefs} and {@link loadExternalDisable} serially — two round
 *  trips of the same document before the first paint, and the second had no
 *  timeout, so a stalled wire could keep the sidebar unmounted forever). */
export interface BootDecision {
    prefs: SidebarPrefs;
    suspended: boolean;
}
export declare function loadBootDecision(settings: SidebarSettingsClient): Promise<BootDecision>;
/**
 * Resolve the boot decision within `timeoutMs`, and when the settings route
 * misses that budget, keep watching the SAME read so its answer is still
 * applied late. A timed-out boot must not strand the store on its defaults
 * forever: the store's own `settings/document-updated` path fires on a
 * DOCUMENT change, not on a late read, so a disabled third-party tab type
 * would otherwise stay registered until the user toggled it (#1159).
 *
 * `loadBootDecision` never rejects (it falls back to the schema defaults), so
 * only the late-resolving case needs a continuation. `onLate` runs at most
 * once, and only when the timeout won the race — never after an in-time
 * answer. The caller still owns its liveness / supersession checks (a
 * disposed fiber, or a newer settings update that already applied).
 * @param settings - the settings wire face (the plugin api by default).
 * @param onLate - receives the answer that landed after the timeout.
 * @param timeoutMs - the first-paint budget in milliseconds.
 * @returns the in-time decision, or null when the timeout won the race.
 */
export declare function awaitBootDecision(settings: SidebarSettingsClient, onLate: (decision: BootDecision) => void, timeoutMs?: number): Promise<BootDecision | null>;
