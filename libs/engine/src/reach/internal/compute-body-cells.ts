import type { Level, Player } from '@mander/model';
import { flatMap, map } from 'lodash-es';
import { computeTileRange } from '../../collision/compute-tile-range';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { computeCellIndex } from './compute-cell-index';

export const computeBodyCells = (level: Level, player: Player): number[] =>
  flatMap(computeTileRange(player.position.y, PLAYER_HEIGHT), (row) =>
    map(computeTileRange(player.position.x, PLAYER_WIDTH), (column) =>
      computeCellIndex(level, row, column),
    ),
  );
