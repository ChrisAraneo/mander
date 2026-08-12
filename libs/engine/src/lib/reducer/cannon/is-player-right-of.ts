import { type Cannon, type Player, TILE_SIZE } from '@mander/model';

import { PLAYER_WIDTH } from '../player/consts';

export const isPlayerRightOf = (cannon: Cannon, player: Player): boolean =>
  player.position.x + PLAYER_WIDTH / 2 >= cannon.position.x + TILE_SIZE / 2;
