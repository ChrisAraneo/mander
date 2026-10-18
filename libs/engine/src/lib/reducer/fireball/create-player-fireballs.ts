import type { Fireball, Item, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { getPlayerCentre } from '../player/get-player-centre';
import { countStartingFireballs } from './count-starting-fireballs';
import { createFireballRing } from './internal/create-fireball-ring';

export const createPlayerFireballs = (
  inventory: readonly Item[],
  player: Player,
  isMoonMagnetOn = true,
): Fireball[] =>
  createFireballRing(
    match(isMoonMagnetOn)
      .with(false, () => 0)
      .otherwise(() => countStartingFireballs(inventory)),
    getPlayerCentre(player),
  );
