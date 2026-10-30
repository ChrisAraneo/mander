import type { Level } from '../../types/level';
import type { Season } from './season';

export interface World {
  name: string;
  season: Season;
  levels: Level[];
  score: number;
}
