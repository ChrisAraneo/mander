import type { Fireball, Player } from '@mander/model';
import { some } from 'lodash-es';
import { isIceball } from './is-iceball';
import { isTouchingFireball } from './is-touching-fireball';

export const isFreezing = (player: Player, fireballs: Fireball[]): boolean =>
  some(
    fireballs,
    (fireball) => isIceball(fireball) && isTouchingFireball(player, fireball),
  );
