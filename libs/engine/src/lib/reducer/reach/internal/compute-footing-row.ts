import { type Player, TILE_SIZE } from '@mander/model';
import { round } from 'lodash-es';
import { PLAYER_HEIGHT } from '../../player/consts';

export const computeFootingRow = (player: Player): number =>
  round((player.position.y + PLAYER_HEIGHT) / TILE_SIZE);
