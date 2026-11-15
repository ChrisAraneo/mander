import { type Player, TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { ICE_PROBE_DEPTH, PLAYER_HEIGHT } from '../consts';

export const computePlayerFootRow = (player: Player): number =>
  floor((player.position.y + PLAYER_HEIGHT + ICE_PROBE_DEPTH) / TILE_SIZE);
