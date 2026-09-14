import type { Fireball } from '@mander/model';
import type { Point } from '@mander/utils';

import { PLAYER_FIREBALL_ORBIT_RADIUS } from './consts';
import { getFireballPosition } from './get-fireball-position';

export const getPlayerFireballPosition = (fireball: Fireball): Point =>
  getFireballPosition(fireball, PLAYER_FIREBALL_ORBIT_RADIUS);
