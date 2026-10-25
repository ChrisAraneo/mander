import type { Level } from '../../types/level';

export interface World {
  name: string;
  levels: Level[];
  score: number;
}
