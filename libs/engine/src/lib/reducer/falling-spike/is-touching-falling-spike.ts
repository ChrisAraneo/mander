import {
  computeFallingSpikeTriangles,
  type FallingSpike,
  type Player,
} from '@mander/model';
import { some } from 'lodash-es';

import { isBoxHittingTriangle } from '../collision/is-box-hitting-triangle';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';

export const isTouchingFallingSpike = (
  player: Player,
  spike: FallingSpike,
): boolean =>
  some(computeFallingSpikeTriangles(spike), (triangle) =>
    isBoxHittingTriangle(
      player.position.x,
      player.position.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      triangle,
    ),
  );
