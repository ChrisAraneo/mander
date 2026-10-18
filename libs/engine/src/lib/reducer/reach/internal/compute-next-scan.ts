import { type Player, chain } from '@mander/model';
import { flatMap, map } from 'lodash-es';
import { computeStateCells } from './compute-state-cells';
import { filterLandings } from './filter-landings';
import { hashPlayerNode } from './hash-player-node';
import type { Scan } from './types/scan';
import type { Walk } from './types/walk';

export const computeNextScan = (
  walk: Walk,
  scan: Scan,
  states: Player[],
): Scan =>
  chain(filterLandings(scan.visited, states))
    .thru((nodes) => ({
      visited: new Set([
        ...scan.visited,
        ...map(nodes, (node) => hashPlayerNode(node)),
      ]),
      cells: new Set([
        ...scan.cells,
        ...flatMap(states, (state) => computeStateCells(walk.level, state)),
      ]),
      frontier: nodes,
    }))
    .value();
