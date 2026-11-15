import type { GameState } from '../state/types/game-state';
import { createJumpTestState } from './create-jump-test-state';

const DYING_SECONDS = 0.5;

export const createDyingJumpTestState = (): GameState => ({
  ...createJumpTestState(),
  player: {
    ...createJumpTestState().player,
    timers: { ...createJumpTestState().player.timers, death: DYING_SECONDS },
  },
});
