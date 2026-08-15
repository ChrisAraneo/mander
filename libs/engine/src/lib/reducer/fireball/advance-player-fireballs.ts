import { type Fireball, MAX_TICK_SECONDS, type Player } from '@mander/model';
import { map } from 'lodash-es';

import { playerCentre } from '../player/player-centre';
import { PLAYER_FIREBALL_ANGULAR_SPEED } from './consts';
import { stepFireball } from './step-fireball';

export const advancePlayerFireballs = (
  fireballs: Fireball[],
  player: Player,
  elapsedSeconds: number,
): Fireball[] =>
  map(fireballs, (fireball) => ({
    ...stepFireball(
      fireball,
      Math.min(elapsedSeconds, MAX_TICK_SECONDS),
      PLAYER_FIREBALL_ANGULAR_SPEED,
    ),
    origin: playerCentre(player),
  }));
