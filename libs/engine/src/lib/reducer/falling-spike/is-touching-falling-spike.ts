import {
  type FallingSpike,
  fallingSpikeTriangles,
  type Player,
} from '@mander/model';
import { some } from 'lodash-es';

import { boxHitsTriangle } from '../collision/box-hits-triangle';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';

export const isTouchingFallingSpike = (
  player: Player,
  spike: FallingSpike,
): boolean =>
  some(fallingSpikeTriangles(spike), (triangle) =>
    boxHitsTriangle(
      player.position.x,
      player.position.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      triangle,
    ),
  );
