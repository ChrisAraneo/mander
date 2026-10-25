import type { GameState } from '@mander/engine';
import type { BackdropFrame } from '../types/backdrop-frame';

export const createBackdropStartFrame = (state: GameState): BackdropFrame => ({
  previous: state,
  current: state,
});
