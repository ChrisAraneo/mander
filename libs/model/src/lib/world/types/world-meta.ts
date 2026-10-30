import type { Season } from './season';
import type { WorldLevelMeta } from './world-level-meta';

export interface WorldMeta {
  name: string;
  season: Season;
  levels: WorldLevelMeta[];
}
