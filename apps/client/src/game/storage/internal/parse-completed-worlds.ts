import { filter, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { CompletedWorld } from '../types/completed-world';
import { isCompletedWorld } from './is-completed-world';
import { parseArray } from './parse-array';
import { toCompletedWorld } from './to-completed-world';

export const parseCompletedWorlds = (value: unknown): CompletedWorld[] =>
  pipe(
    value,
    parseArray,
    (items) => filter(items, isCompletedWorld),
    (worlds) => map(worlds, toCompletedWorld),
  );
