import { concat } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { createFiredBullet } from '../../bullet/create-fired-bullet';

export const patchFiredBullet = (state: GameState): GameState => ({
  ...state,
  ammo: state.ammo - 1,
  bullets: concat(state.bullets, createFiredBullet(state.player)),
});
