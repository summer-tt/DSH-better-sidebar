/** Display-only labels for discovered checkout roots. No filesystem or browser-platform access. */
export interface RepositoryLabel {
    readonly root: string;
    readonly label: string;
}
/**
 * Build labels once for the complete list. Short names cover the base, its
 * direct children and an unknown base; deeper paths expose their full relative
 * parent. Roots outside a known base show short parent context. Collisions
 * expand context up to absolute/raw paths, never numbers. Exact duplicate roots
 * share a label and keep their original rows.
 */
export declare function buildRepositoryLabels(roots: readonly string[], displayCwd: string | undefined, hostHome?: string): readonly RepositoryLabel[];
