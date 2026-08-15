import type { Fireball, Item, Player } from '@mander/model';
import { times } from 'lodash-es';

import { playerCentre } from '../player/player-centre';
import { startingFireballs } from './starting-fireballs';

const FULL_TURN = Math.PI * 2;

const spread = (count: number, origin: Fireball['origin']): Fireball[] =>
  times(count, (index): Fireball => ({
    spin: 'CLOCKWISE',
    origin,
    angle: (index * FULL_TURN) / count,
  }));

export const createPlayerFireballs = (
  inventory: readonly Item[],
  player: Player,
): Fireball[] => spread(startingFireballs(inventory), playerCentre(player));
