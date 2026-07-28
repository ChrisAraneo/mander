import { round } from 'lodash-es';

import type { Player } from '../state';
import { NODE_KEY_STRIDE, POSITION_QUANTUM } from './internal-constants';

export const nodeKey = (player: Player): number =>
  round(player.position.x / POSITION_QUANTUM) * NODE_KEY_STRIDE +
  round(player.position.y / POSITION_QUANTUM);
