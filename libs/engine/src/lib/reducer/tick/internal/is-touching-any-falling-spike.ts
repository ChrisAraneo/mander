import type { FallingSpike, Player } from '@mander/model';
import { includes, some } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { isTouchingFallingSpike } from '../../falling-spike/is-touching-falling-spike';
import { findBitingSpikes } from '../../ward/find-biting-spikes';

export const isTouchingAnyFallingSpike = (
  state: GameState,
  player: Player,
  fallingSpikes: FallingSpike[],
): boolean =>
  includes(findBitingSpikes(state.inventory), 'CEILING') &&
  some(fallingSpikes, (spike) => isTouchingFallingSpike(player, spike));
