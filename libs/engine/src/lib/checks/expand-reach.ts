import type { TileMap } from '../world';
import { chain } from '@mander/utils';
import { flatMap, map } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Player } from '../state';
import { MAX_NODES } from './internal-constants';
import { nodeKey } from './node-key';
import { MOVE_PLANS } from './move-plans';
import { simulatePlan } from './simulate-plan';
import { stateCells } from './state-cells';

interface Walk {
  tiles: TileMap;
}

interface Scan {
  visited: Set<number>;
  cells: Set<number>;
  frontier: Player[];
}

const flightStates = (walk: Walk, frontier: Player[]): Player[] =>
  flatMap(frontier, (player) =>
    flatMap(MOVE_PLANS, (plan) => simulatePlan(walk.tiles, plan, player)),
  );

const landings = (visited: ReadonlySet<number>, states: Player[]): Player[] =>
  chain(states)
    .filter((state) => state.isGrounded)
    .filter((state) => !visited.has(nodeKey(state)))
    .uniqBy((state) => nodeKey(state))
    .value();

const merged = (walk: Walk, scan: Scan, states: Player[]): Scan =>
  chain(landings(scan.visited, states))
    .thru((nodes) => ({
      visited: new Set([
        ...scan.visited,
        ...map(nodes, (node) => nodeKey(node)),
      ]),
      cells: new Set([
        ...scan.cells,
        ...flatMap(states, (state) => stateCells(walk.tiles, state)),
      ]),
      frontier: nodes,
    }))
    .value();

const expand = (walk: Walk, scan: Scan): Scan =>
  chain(merged(walk, scan, flightStates(walk, scan.frontier)))
    .thru((next) =>
      match(next.frontier.length === 0 || next.visited.size >= MAX_NODES)
        .with(true, () => next)
        .otherwise(() => expand(walk, next)),
    )
    .value();

export const expandReach = (
  tiles: TileMap,
  start: Player,
): ReadonlySet<number> =>
  expand(
    { tiles },
    {
      visited: new Set([nodeKey(start)]),
      cells: new Set(stateCells(tiles, start)),
      frontier: [start],
    },
  ).cells;
