import type { LevelMeta } from '../level/level-meta';

export interface WorldLevelMeta extends LevelMeta {
  level: number;
}

export interface WorldMeta {
  name: string;
  levels: WorldLevelMeta[];
}
