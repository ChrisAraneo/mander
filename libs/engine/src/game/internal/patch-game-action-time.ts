import type { GameState } from '../../state/types/game-state';
import type { GameActionResult } from './types/game-action-result';

export const patchGameActionTime = ({
  now,
  startTime,
  nextState,
}: GameActionResult): GameState => ({
  ...nextState,
  updateTime: now() - startTime,
});
