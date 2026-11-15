import type { Enemy, Player, Snowball } from '@mander/model';
import { computeFacingStep } from '../../facing/compute-facing-step';
import { toFacing } from '../../facing/to-facing';
import { SNOWBALL_SIZE, SNOWBALL_SPEED } from '../../snowball/consts';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { isPlayerRightOfShooter } from './is-player-right-of-shooter';

export const createShotSnowball = (
  freezer: Enemy,
  player: Player,
): Snowball => ({
  position: {
    x: freezer.position.x + (ENEMY_WIDTH - SNOWBALL_SIZE) / 2,
    y: freezer.position.y + (ENEMY_HEIGHT - SNOWBALL_SIZE) / 2,
  },
  velocity: {
    x: {
      current:
        computeFacingStep(toFacing(isPlayerRightOfShooter(freezer, player))) *
        SNOWBALL_SPEED,
      max: SNOWBALL_SPEED,
    },
  },
});
