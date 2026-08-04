import type { Level } from '../level/level';

export interface World {
  name: string;
  levels: Level[];
  score: number;
}
