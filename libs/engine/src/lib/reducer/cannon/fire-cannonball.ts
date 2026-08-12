import { type Cannon, type Cannonball, TILE_SIZE } from '@mander/model';
import { match } from 'ts-pattern';

import { CANNONBALL_SIZE, CANNONBALL_SPEED } from './consts';

const facingOf = (cannon: Cannon): 1 | -1 =>
  match(cannon.statuses.isFacingRight)
    .with(true, (): 1 | -1 => 1)
    .otherwise((): 1 | -1 => -1);

export const fireCannonball = (cannon: Cannon): Cannonball => ({
  position: {
    x: cannon.position.x + (TILE_SIZE - CANNONBALL_SIZE) / 2,
    y: cannon.position.y + (TILE_SIZE - CANNONBALL_SIZE) / 2,
  },
  velocity: {
    x: {
      current: facingOf(cannon) * CANNONBALL_SPEED,
      max: CANNONBALL_SPEED,
    },
  },
});
