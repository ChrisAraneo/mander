import { match } from 'ts-pattern';

import type { ReachMap } from './reach-map';

export const isReachableCell = (
  reach: ReachMap,
  row: number,
  col: number,
): boolean =>
  match(row >= 0 && col >= 0)
    .with(true, () => (reach.at(row) ?? []).at(col) ?? false)
    .otherwise(() => false);
