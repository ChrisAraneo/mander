import {
  computeFallingSpikeTriangles,
  type FallingSpike,
  type Player,
} from '@mander/model';
import { some } from 'lodash-es';
import { isOverlappingTriangle } from '../collision/is-overlapping-triangle';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';

export const isTouchingFallingSpike = (
  spike: FallingSpike,
  player: Player,
): boolean =>
  some(computeFallingSpikeTriangles(spike), (triangle) =>
    isOverlappingTriangle(
      triangle,
      player.position.x,
      player.position.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
    ),
  );
