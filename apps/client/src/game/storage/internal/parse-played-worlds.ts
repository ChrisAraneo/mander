import { filter, get, isObjectLike, isString, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { PlayedWorld } from '../types/played-world';
import { parseArray } from './parse-array';
import { parseNumber } from './parse-number';
import { parseString } from './parse-string';

const isPlayedWorld = (value: unknown): value is Partial<PlayedWorld> =>
  isObjectLike(value) && isString(get(value, 'name'));

const toPlayedWorld = (world: Partial<PlayedWorld>): PlayedWorld => ({
  name: parseString(world.name),
  day: parseString(world.day),
  playedAt: parseString(world.playedAt),
  runs: parseNumber(world.runs),
});

export const parsePlayedWorlds = (value: unknown): PlayedWorld[] =>
  pipe(
    value,
    parseArray,
    (items) => filter(items, isPlayedWorld),
    (worlds) => map(worlds, toPlayedWorld),
  );
