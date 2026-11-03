import { type Cannon, type Cannonball, TILE_SIZE } from '@mander/model';
import { toFacing } from '../internal/to-facing';
import { CANNONBALL_SIZE, CANNONBALL_SPEED } from './consts';

export const createFiredCannonball = (
  cannon: Cannon,
  angle: number,
): Cannonball => ({
  position: {
    x: cannon.position.x + (TILE_SIZE - CANNONBALL_SIZE) / 2,
    y: cannon.position.y + (TILE_SIZE - CANNONBALL_SIZE) / 2,
  },
  velocity: {
    x: {
      current:
        toFacing(cannon.statuses.isFacingRight) *
        CANNONBALL_SPEED *
        Math.cos(angle),
      max: CANNONBALL_SPEED,
    },
    y: {
      current: CANNONBALL_SPEED * Math.sin(angle),
      max: CANNONBALL_SPEED,
    },
  },
});
