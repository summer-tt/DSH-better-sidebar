/** Durable thread identity for native side-chat occurrences. The host persists
 * contentId, but not navigation.params. Never restore by tab1 or session-last:
 * both can name a different conversation after a new tab/layout is created. */
export declare const SIDECHAT_BINDINGS_KEY = "dsh-sidebar:v1:native-sidechat-bindings";
/** The host page address prefix of an independent side-chat occurrence. */
export declare const SIDECHAT_CONTENT_PREFIX = "sidebar://sidechat/";
/**
 * Whether a native tab is an independent side-chat page. The shared page's
 * contentId is exactly `sidebar://sidechat`; only the multi-page mode appends
 * a random occurrence id. Bindings are meaningless for the shared page: its
 * state is the session's last/newest thread, not an occurrence identity.
 * @param kind - the host tab kind.
 * @param contentId - the host page identity.
 * @returns true for one multi-page side-chat occurrence.
 */
export declare function isSidechatOccurrence(kind: string, contentId: string | undefined): boolean;
export interface SidechatBinding {
    sessionId: string;
    contentId: string;
    threadId: string;
    title: string;
}
/** Only identity and a display label are persisted; never transcripts/drafts. */
export declare function createSidechatBindings(): {
    get(sessionId: string, contentId: string): SidechatBinding | undefined;
    set(sessionId: string, contentId: string, threadId: string, title: string): void;
    delete(sessionId: string, contentId: string): void;
};
