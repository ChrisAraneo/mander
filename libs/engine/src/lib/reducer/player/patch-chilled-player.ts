import type { Player, Snowball } from '@mander/model';
import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { COLD_SECONDS } from './consts';

export const patchChilledPlayer = (
  player: Player,
  chills: Snowball[],
): Player =>
  match(isEmpty(chills))
    .with(true, () => player)
    .otherwise((): Player => ({
      ...player,
      timers: { ...player.timers, cold: COLD_SECONDS },
    }));
