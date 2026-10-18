import { createInitialState, type GameState } from '@mander/engine';
import { assign } from 'lodash-es';
import { createRenderTestLevel } from './create-render-test-level';

export const createRenderTestState = (
  rows: string[],
  patch: Partial<GameState> = {},
): GameState =>
  assign({}, createInitialState(createRenderTestLevel(rows), 0, []), patch);
