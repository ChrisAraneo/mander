import type { Player, Snowball } from '@mander/model';
import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { patchColdPlayer } from './patch-cold-player';

export const patchChilledPlayer = (
  player: Player,
  chills: Snowball[],
): Player =>
  match(isEmpty(chills))
    .with(true, () => player)
    .otherwise(() => patchColdPlayer(player));
