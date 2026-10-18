import { chain } from '@mander/model';
import { size } from 'lodash-es';
import { match } from 'ts-pattern';
import { MAX_NODES } from '../consts';
import { computeNextScan } from './compute-next-scan';
import { runMovePlans } from './run-move-plans';
import type { Scan } from './types/scan';
import type { Walk } from './types/walk';

export const computeExpandedScan = (walk: Walk, scan: Scan): Scan =>
  chain(computeNextScan(walk, scan, runMovePlans(walk, scan.frontier)))
    .thru((next) =>
      match(size(next.frontier) === 0 || next.visited.size >= MAX_NODES)
        .with(true, () => next)
        .otherwise(() => computeExpandedScan(walk, next)),
    )
    .value();
