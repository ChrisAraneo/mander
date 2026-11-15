import type { Player, Snowball } from '@mander/model';
import { filter } from 'lodash-es';
import { isTouchingSnowball } from './is-touching-snowball';

export const filterChillingSnowballs = (
  player: Player,
  snowballs: Snowball[],
): Snowball[] =>
  filter(snowballs, (snowball) => isTouchingSnowball(player, snowball));
