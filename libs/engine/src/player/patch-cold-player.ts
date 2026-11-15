import type { Player } from '@mander/model';
import { COLD_SECONDS } from './consts';

export const patchColdPlayer = (player: Player): Player => ({
  ...player,
  timers: { ...player.timers, cold: COLD_SECONDS },
});
