import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import { patchColdPlayer } from './patch-cold-player';

export const patchFrozenPlayer = (player: Player, isFrozen: boolean): Player =>
  match(isFrozen)
    .with(true, () => patchColdPlayer(player))
    .otherwise(() => player);
