import { compact, filter, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { RunRecord } from '../types/run-record';
import { isRunRecord } from './is-run-record';
import { parseArray } from './parse-array';
import { toRunRecord } from './to-run-record';

export const parseRuns = (value: unknown): RunRecord[] =>
  pipe(
    value,
    parseArray,
    (items) => filter(items, isRunRecord),
    (runs) => map(runs, toRunRecord),
    compact,
  );
