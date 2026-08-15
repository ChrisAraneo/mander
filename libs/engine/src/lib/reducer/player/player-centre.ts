import type { Player } from '@mander/model';
import type { Point } from '@mander/utils';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from './consts';

export const playerCentre = (player: Player): Point => ({
  x: player.position.x + PLAYER_WIDTH / 2,
  y: player.position.y + PLAYER_HEIGHT / 2,
});
