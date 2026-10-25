import type { CompletedWorld } from '../types/completed-world';
import { parseNumber } from './parse-number';
import { parsePackedReplay } from './parse-packed-replay';
import { parseString } from './parse-string';

export const toCompletedWorld = (
  world: Partial<CompletedWorld>,
): CompletedWorld => ({
  name: parseString(world.name),
  day: parseString(world.day),
  score: parseNumber(world.score),
  seconds: parseNumber(world.seconds),
  runId: parseString(world.runId),
  replay: parsePackedReplay(world.replay),
});
