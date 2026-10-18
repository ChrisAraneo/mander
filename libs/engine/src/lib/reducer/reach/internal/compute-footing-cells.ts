import { isSolid, type Level, type Player } from '@mander/model';
import { filter, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { computeTileRange } from '../../collision/compute-tile-range';
import { PLAYER_WIDTH } from '../../player/consts';
import { computeCellIndex } from './compute-cell-index';
import { computeFootingRow } from './compute-footing-row';

export const computeFootingCells = (level: Level, player: Player): number[] =>
  match(player.statuses.isGrounded)
    .with(false, (): number[] => [])
    .otherwise(() =>
      map(
        filter(computeTileRange(player.position.x, PLAYER_WIDTH), (column) =>
          isSolid(level, column, computeFootingRow(player)),
        ),
        (column) => computeCellIndex(level, computeFootingRow(player), column),
      ),
    );
