import {
  type Action,
  type Clock,
  type GameState,
  nextGameState,
} from '@mander/engine';
import { match } from 'ts-pattern';
import type { BackdropFrame } from '../types/backdrop-frame';

const filterPlaying = (idle: GameState, next: GameState): GameState =>
  match(next.status)
    .with('PLAYING', () => next)
    .otherwise(() => idle);

export const nextBackdropFrame = (
  frame: BackdropFrame,
  action: Action,
  idle: GameState,
  now: Clock,
): BackdropFrame => ({
  previous: frame.current,
  current: filterPlaying(idle, nextGameState(frame.current, action, now)),
});
