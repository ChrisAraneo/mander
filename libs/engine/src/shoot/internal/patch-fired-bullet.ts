import { concat } from 'lodash-es';
import { createFiredBullet } from '../../bullet/create-fired-bullet';
import type { GameState } from '../../state/types/game-state';

export const patchFiredBullet = (state: GameState): GameState => ({
  ...state,
  ammo: state.ammo - 1,
  bullets: concat(state.bullets, createFiredBullet(state.player)),
});
