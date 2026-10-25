import type { PlayedWorld } from '../types/played-world';
import { parseNumber } from './parse-number';
import { parseString } from './parse-string';

export const toPlayedWorld = (world: Partial<PlayedWorld>): PlayedWorld => ({
  name: parseString(world.name),
  day: parseString(world.day),
  playedAt: parseString(world.playedAt),
  runs: parseNumber(world.runs),
});
