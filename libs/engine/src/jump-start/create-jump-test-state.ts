import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameState } from '../state/types/game-state';
import { createJumpTestLevel } from './create-jump-test-level';

export const createJumpTestState = (): GameState => ({
  ...createInitialState(createJumpTestLevel(), FIRST_LEVEL_INDEX, []),
  input: { isLeft: true, isRight: false, isJump: false },
});
