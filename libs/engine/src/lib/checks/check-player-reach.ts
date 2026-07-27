import { chain } from '@mander/utils';
import { map, range } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { TileMap } from '../world';
import { cellIndex } from './cell-index';
import { entryPlayer } from './entry-player';
import { expandReach } from './expand-reach';
import type { ReachMap } from './reach-map';

const toReachMap = (tiles: TileMap, cells: ReadonlySet<number>): ReachMap =>
  map(range(tiles.height), (row) =>
    map(range(tiles.width), (col) => cells.has(cellIndex(tiles, row, col))),
  );

export const checkPlayerReach = (tiles: TileMap): ReachMap =>
  chain(entryPlayer(tiles))
    .thru((start) =>
      match(start)
        .with(P.nullish, () => toReachMap(tiles, new Set<number>()))
        .otherwise((entry) => toReachMap(tiles, expandReach(tiles, entry))),
    )
    .value();
