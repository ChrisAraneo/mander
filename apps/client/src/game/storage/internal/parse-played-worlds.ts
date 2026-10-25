import { filter, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { PlayedWorld } from '../types/played-world';
import { isPlayedWorld } from './is-played-world';
import { parseArray } from './parse-array';
import { toPlayedWorld } from './to-played-world';

export const parsePlayedWorlds = (value: unknown): PlayedWorld[] =>
  pipe(
    value,
    parseArray,
    (items) => filter(items, isPlayedWorld),
    (worlds) => map(worlds, toPlayedWorld),
  );
