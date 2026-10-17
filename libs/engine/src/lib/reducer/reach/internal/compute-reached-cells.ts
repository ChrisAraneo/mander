import type { Level, Player } from '@mander/model';
import { computeExpandedScan } from './compute-expanded-scan';
import { computeStateCells } from './compute-state-cells';
import { hashPlayerNode } from './hash-player-node';

export const computeReachedCells = (
  level: Level,
  start: Player,
): ReadonlySet<number> =>
  computeExpandedScan(
    { level },
    {
      visited: new Set([hashPlayerNode(start)]),
      cells: new Set(computeStateCells(level, start)),
      frontier: [start],
    },
  ).cells;
