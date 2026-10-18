import type { FallingSpike, Player } from '@mander/model';
import { some } from 'lodash-es';
import { isTouchingFallingSpike } from '../../falling-spike/is-touching-falling-spike';

export const isTouchingAnyFallingSpike = (
  player: Player,
  fallingSpikes: FallingSpike[],
): boolean =>
  some(fallingSpikes, (spike) => isTouchingFallingSpike(player, spike));
