import { chain } from '@mander/utils';
import { map, range } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { Level } from '@mander/model';
import { getCellIndex } from './get-cell-index';
import { findEntryPlayer } from './find-entry-player';
import { expandReach } from './expand-reach';
import type { ReachMap } from './types/reach-map';

const { nullish } = P;

const createReachMap = (tiles: Level, cells: ReadonlySet<number>): ReachMap =>
  map(range(tiles.height), (row) =>
    map(range(tiles.width), (col) => cells.has(getCellIndex(tiles, row, col))),
  );

export const checkPlayerReach = (tiles: Level): ReachMap =>
  chain(findEntryPlayer(tiles))
    .thru((start) =>
      match(start)
        .with(nullish, () => createReachMap(tiles, new Set<number>()))
        .otherwise((entry) => createReachMap(tiles, expandReach(tiles, entry))),
    )
    .value();
