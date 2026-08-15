import { type Cannon, type Player, TILE_SIZE } from '@mander/model';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { CANNON_RANGE } from './consts';

export const isPlayerInRange = (cannon: Cannon, player: Player): boolean =>
  Math.hypot(
    player.position.x + PLAYER_WIDTH / 2 - (cannon.position.x + TILE_SIZE / 2),
    player.position.y + PLAYER_HEIGHT / 2 - (cannon.position.y + TILE_SIZE / 2),
  ) <= CANNON_RANGE;
