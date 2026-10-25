import type { GameState } from '@mander/engine';
import type { World } from '@mander/model';
import { size } from 'lodash-es';

export const isRunOver = (world: World, state: GameState): boolean =>
  state.status === 'GAME_OVER' ||
  (state.status === 'COMPLETE' && state.levelIndex >= size(world.levels) - 1);
