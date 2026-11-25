import type { MarkdownFileMentions } from '@deepseek-ai/dsh-client-ui-primitives';
import type { HTMLAttributes } from 'react';
import type { Context } from '../context-types.ts';
/** The gesture props the host attaches to one resolved file mention. */
type FileMentionTriggerProps = Pick<HTMLAttributes<HTMLElement>, 'onContextMenu' | 'onKeyDown' | 'tabIndex'>;
/** 根据会话工作目录判定绝对 Markdown 路径，并拒绝宿主会改写的 POSIX 路径。 */
export declare function isAbsoluteMarkdownPath(value: string, cwd?: string): boolean;
/** 在宿主文件认领结果之后追加绝对 Markdown 路径入口。 */
export declare function markdownMentionsFor(owner: {
    openFile: (path: string) => void;
}, stock: MarkdownFileMentions | undefined, cwd?: string, isActive?: () => boolean, getFileTriggerProps?: (path: string) => FileMentionTriggerProps): MarkdownFileMentions;
/** 随宿主服务生命周期注册聊天 Markdown 路径，并在释放后停止扩展认领结果。 */
export declare function registerChatMarkdownMentions(ctx: Context): () => Promise<void>;
export {};
