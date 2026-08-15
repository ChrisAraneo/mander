import type { Fireball } from '@mander/model';
import type { Point } from '@mander/utils';

import { PLAYER_FIREBALL_ORBIT_RADIUS } from './consts';
import { fireballPosition } from './fireball-position';

export const playerFireballPosition = (fireball: Fireball): Point =>
  fireballPosition(fireball, PLAYER_FIREBALL_ORBIT_RADIUS);
