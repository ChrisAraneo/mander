import type { GameState } from '../../../types/game-state';
import { createTickPlayer } from './create-tick-player';
import { patchMovedPlayer } from './patch-moved-player';
import type { TickPlayer } from './types/tick-player';

export const computeTickPlayer = ({
  state,
  deltaSeconds,
}: {
  state: GameState;
  deltaSeconds: number;
}): TickPlayer =>
  createTickPlayer(state, deltaSeconds, patchMovedPlayer(state, deltaSeconds));
