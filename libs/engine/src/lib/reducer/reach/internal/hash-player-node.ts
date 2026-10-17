import type { Player } from '@mander/model';
import { round } from 'lodash-es';
import { NODE_KEY_STRIDE, POSITION_QUANTUM } from '../consts';

export const hashPlayerNode = (player: Player): number =>
  round(player.position.x / POSITION_QUANTUM) * NODE_KEY_STRIDE +
  round(player.position.y / POSITION_QUANTUM);
