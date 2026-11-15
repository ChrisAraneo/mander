import type { Player, Snowball } from '@mander/model';
import { patchChilledPlayer } from '../../player/patch-chilled-player';
import { patchFrozenPlayer } from '../../player/patch-frozen-player';

export const patchColdTickPlayer = (
  player: Player,
  chills: Snowball[],
  isFrozen: boolean,
): Player => patchFrozenPlayer(patchChilledPlayer(player, chills), isFrozen);
