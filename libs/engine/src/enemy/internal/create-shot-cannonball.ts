import type { Cannonball, Enemy, Player } from '@mander/model';
import { CANNONBALL_SIZE, CANNONBALL_SPEED } from '../../cannon/consts';
import { computeFacingStep } from '../../facing/compute-facing-step';
import { toFacing } from '../../facing/to-facing';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { isPlayerRightOfShooter } from './is-player-right-of-shooter';

export const createShotCannonball = (
  shooter: Enemy,
  player: Player,
): Cannonball => ({
  position: {
    x: shooter.position.x + (ENEMY_WIDTH - CANNONBALL_SIZE) / 2,
    y: shooter.position.y + (ENEMY_HEIGHT - CANNONBALL_SIZE) / 2,
  },
  velocity: {
    x: {
      current:
        computeFacingStep(toFacing(isPlayerRightOfShooter(shooter, player))) *
        CANNONBALL_SPEED,
      max: CANNONBALL_SPEED,
    },
    y: {
      current: 0,
      max: CANNONBALL_SPEED,
    },
  },
});
