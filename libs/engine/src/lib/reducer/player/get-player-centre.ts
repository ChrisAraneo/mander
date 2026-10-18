import type { Player, Point } from '@mander/model';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './consts';

export const getPlayerCentre = (player: Player): Point => ({
  x: player.position.x + PLAYER_WIDTH / 2,
  y: player.position.y + PLAYER_HEIGHT / 2,
});
