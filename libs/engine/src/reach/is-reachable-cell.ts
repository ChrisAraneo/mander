import { nth } from 'lodash-es';
import { match } from 'ts-pattern';
import type { ReachMap } from './types/reach-map';

export const isReachableCell = (
  reach: ReachMap,
  row: number,
  column: number,
): boolean =>
  match(row >= 0 && column >= 0)
    .with(true, () => nth(nth(reach, row), column) ?? false)
    .otherwise(() => false);
