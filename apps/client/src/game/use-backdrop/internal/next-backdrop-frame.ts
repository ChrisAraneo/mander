import {
  type Action,
  type Clock,
  type GameState,
  nextGameState,
} from '@mander/engine';
import type { BackdropFrame } from '../types/backdrop-frame';
import { filterPlaying } from './filter-playing';

export const nextBackdropFrame = (
  frame: BackdropFrame,
  action: Action,
  idle: GameState,
  now: Clock,
): BackdropFrame => ({
  previous: frame.current,
  current: filterPlaying(idle, nextGameState(frame.current, action, now)),
});
