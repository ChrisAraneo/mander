import { concat } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { fireBullet } from '../../bullet/fire-bullet';

export const patchFiredBullet = (state: GameState): GameState => ({
  ...state,
  ammo: state.ammo - 1,
  bullets: concat(state.bullets, fireBullet(state.player)),
});
