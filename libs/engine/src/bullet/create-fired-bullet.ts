import type { Bullet, Player } from '@mander/model';
import { computeFacingStep } from '../facing/compute-facing-step';
import { toFacing } from '../facing/to-facing';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { BULLET_MUZZLE_RATIO, BULLET_SIZE, BULLET_SPEED } from './consts';

export const createFiredBullet = (player: Player): Bullet => ({
  position: {
    x: player.position.x + (PLAYER_WIDTH - BULLET_SIZE) / 2,
    y:
      player.position.y + PLAYER_HEIGHT * BULLET_MUZZLE_RATIO - BULLET_SIZE / 2,
  },
  velocity: {
    x: {
      current:
        computeFacingStep(toFacing(player.statuses.isFacingRight)) *
        BULLET_SPEED,
      max: BULLET_SPEED,
    },
  },
});
