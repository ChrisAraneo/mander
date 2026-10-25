import type { WorldLevelMeta } from './world-level-meta';

export interface WorldMeta {
  name: string;
  levels: WorldLevelMeta[];
}
