import { isIce, type Level, type Player, TILE_SIZE } from '@mander/model';
import { floor, some } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { computeTileRange } from '../../collision/compute-tile-range';
import { ICE_PROBE_DEPTH, PLAYER_HEIGHT, PLAYER_WIDTH } from '../consts';

export const isOnIce = (level: Level, player: Player): boolean =>
  match(player.statuses.isGrounded)
    .with(false, () => false)
    .otherwise(() =>
      pipe(
        floor(
          (player.position.y + PLAYER_HEIGHT + ICE_PROBE_DEPTH) / TILE_SIZE,
        ),
        (row) =>
          some(computeTileRange(player.position.x, PLAYER_WIDTH), (column) =>
            isIce(level, column, row),
          ),
      ),
    );
