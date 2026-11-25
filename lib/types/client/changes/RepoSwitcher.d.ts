import type { RepositoryLabel } from './repo-labels.ts';
export interface RepoSwitcherProps {
    /** Discovered roots in discovery order, with display-only labels. */
    readonly labels: readonly RepositoryLabel[];
    /** The RESOLVED root (never the stale request), when known. */
    readonly value: string | undefined;
    /** Label for a resolved root that is no longer in the discovered list. */
    readonly standInLabel: string | undefined;
    readonly disabled: boolean;
    /** Whether the hosting tab is on screen (gates the resize observer). */
    readonly visible: boolean;
    readonly onChoose: (root: string) => void;
}
/**
 * Render the responsive repository switcher.
 * @param props - labels, resolved root, and the existing chooseRepo callback.
 * @returns the switcher, or nothing when only one root exists.
 */
export declare function RepoSwitcher({ labels, value, standInLabel, disabled, visible, onChoose }: RepoSwitcherProps): import("react").JSX.Element | null;
