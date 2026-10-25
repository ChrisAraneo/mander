import { size } from 'lodash-es';
import { match } from 'ts-pattern';
import { MAX_NODES } from '../consts';
import { computeNextScan } from './compute-next-scan';
import { runMovePlans } from './run-move-plans';
import type { Scan } from './types/scan';
import type { Walk } from './types/walk';

export const computeExpandedScan = (walk: Walk, scan: Scan): Scan =>
  match(computeNextScan(walk, scan, runMovePlans(walk, scan.frontier)))
    .when(
      (next) => size(next.frontier) === 0 || size(next.visited) >= MAX_NODES,
      (next) => next,
    )
    .otherwise((next) => computeExpandedScan(walk, next));
