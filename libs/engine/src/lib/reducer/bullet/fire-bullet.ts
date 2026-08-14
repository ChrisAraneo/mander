import type { Bullet, Player } from '@mander/model';
import { match } from 'ts-pattern';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { BULLET_MUZZLE_RATIO, BULLET_SIZE, BULLET_SPEED } from './consts';

const facingOf = (player: Player): 1 | -1 =>
  match(player.statuses.isFacingRight)
    .with(true, (): 1 | -1 => 1)
    .otherwise((): 1 | -1 => -1);

export const fireBullet = (player: Player): Bullet => ({
  position: {
    x: player.position.x + (PLAYER_WIDTH - BULLET_SIZE) / 2,
    y:
      player.position.y + PLAYER_HEIGHT * BULLET_MUZZLE_RATIO - BULLET_SIZE / 2,
  },
  velocity: {
    x: {
      current: facingOf(player) * BULLET_SPEED,
      max: BULLET_SPEED,
    },
  },
});
