import { filter, get, isObjectLike, isString, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { CompletedWorld } from '../types/completed-world';
import { parseArray } from './parse-array';
import { parseNumber } from './parse-number';
import { parsePackedReplay } from './parse-packed-replay';
import { parseString } from './parse-string';

const isCompletedWorld = (value: unknown): value is Partial<CompletedWorld> =>
  isObjectLike(value) && isString(get(value, 'name'));

const toCompletedWorld = (world: Partial<CompletedWorld>): CompletedWorld => ({
  name: parseString(world.name),
  day: parseString(world.day),
  score: parseNumber(world.score),
  seconds: parseNumber(world.seconds),
  runId: parseString(world.runId),
  replay: parsePackedReplay(world.replay),
});

export const parseCompletedWorlds = (value: unknown): CompletedWorld[] =>
  pipe(
    value,
    parseArray,
    (items) => filter(items, isCompletedWorld),
    (worlds) => map(worlds, toCompletedWorld),
  );
