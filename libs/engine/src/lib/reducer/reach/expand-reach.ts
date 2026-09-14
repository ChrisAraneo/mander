import type { Level, Player } from '@mander/model';
import { chain } from '@mander/utils';
import { flatMap, map } from 'lodash-es';
import { match } from 'ts-pattern';

import { MAX_NODES } from './consts';
import { getNodeKey } from './get-node-key';
import { MOVE_PLANS } from './move-plans';
import { simulatePlan } from './simulate-plan';
import { getStateCells } from './get-state-cells';
import type { Scan } from './types/scan';
import type { Walk } from './types/walk';

const simulateFlights = (walk: Walk, frontier: Player[]): Player[] =>
  flatMap(frontier, (player) =>
    flatMap(MOVE_PLANS, (plan) => simulatePlan(walk.tiles, plan, player)),
  );

const filterLandings = (
  visited: ReadonlySet<number>,
  states: Player[],
): Player[] =>
  chain(states)
    .filter((state) => state.statuses.isGrounded)
    .filter((state) => !visited.has(getNodeKey(state)))
    .uniqBy((state) => getNodeKey(state))
    .value();

const mergeLandings = (walk: Walk, scan: Scan, states: Player[]): Scan =>
  chain(filterLandings(scan.visited, states))
    .thru((nodes) => ({
      visited: new Set([
        ...scan.visited,
        ...map(nodes, (node) => getNodeKey(node)),
      ]),
      cells: new Set([
        ...scan.cells,
        ...flatMap(states, (state) => getStateCells(walk.tiles, state)),
      ]),
      frontier: nodes,
    }))
    .value();

const expand = (walk: Walk, scan: Scan): Scan =>
  chain(mergeLandings(walk, scan, simulateFlights(walk, scan.frontier)))
    .thru((next) =>
      match(next.frontier.length === 0 || next.visited.size >= MAX_NODES)
        .with(true, () => next)
        .otherwise(() => expand(walk, next)),
    )
    .value();

export const expandReach = (tiles: Level, start: Player): ReadonlySet<number> =>
  expand(
    { tiles },
    {
      visited: new Set([getNodeKey(start)]),
      cells: new Set(getStateCells(tiles, start)),
      frontier: [start],
    },
  ).cells;
