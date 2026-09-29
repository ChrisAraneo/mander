import { type FallingSpike, type Player, TILE_SIZE } from '@mander/model';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import {
  FALLING_SPIKE_TRIGGER_DEPTH,
  FALLING_SPIKE_TRIGGER_RANGE,
} from './consts';

const getGap = (spike: FallingSpike, player: Player): number =>
  player.position.x + PLAYER_WIDTH / 2 - (spike.position.x + TILE_SIZE / 2);

const getDepth = (spike: FallingSpike, player: Player): number =>
  player.position.y + PLAYER_HEIGHT / 2 - (spike.position.y + TILE_SIZE / 2);

export const isPlayerInRange = (spike: FallingSpike, player: Player): boolean =>
  Math.abs(getGap(spike, player)) <= FALLING_SPIKE_TRIGGER_RANGE &&
  getDepth(spike, player) > 0 &&
  getDepth(spike, player) <= FALLING_SPIKE_TRIGGER_DEPTH;
