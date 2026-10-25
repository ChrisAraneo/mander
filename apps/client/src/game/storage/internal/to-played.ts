import type { CompletedWorld } from '../types/completed-world';
import type { PlayedWorld } from '../types/played-world';

export const toPlayed = (world: CompletedWorld): PlayedWorld => ({
  name: world.name,
  day: world.day,
  playedAt: '',
  runs: 1,
});
