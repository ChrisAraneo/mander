import { type Player } from '@mander/model';
import { flatMap, map } from 'lodash-es';
import { computeStateCells } from './compute-state-cells';
import { filterLandings } from './filter-landings';
import { hashPlayerNode } from './hash-player-node';
import type { Scan } from './types/scan';
import type { Walk } from './types/walk';

const createNextScan = (
  walk: Walk,
  scan: Scan,
  states: Player[],
  nodes: Player[],
): Scan => ({
  visited: new Set([
    ...scan.visited,
    ...map(nodes, (node) => hashPlayerNode(node)),
  ]),
  cells: new Set([
    ...scan.cells,
    ...flatMap(states, (state) => computeStateCells(walk.level, state)),
  ]),
  frontier: nodes,
});

export const computeNextScan = (
  walk: Walk,
  scan: Scan,
  states: Player[],
): Scan =>
  createNextScan(walk, scan, states, filterLandings(scan.visited, states));
