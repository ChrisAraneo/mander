import { type Action, type Clock, nextGameState } from '@mander/engine';
import { match } from 'ts-pattern';
import type { GameFrame } from '../types/game-frame';

export const nextGameFrame = (
  frame: GameFrame,
  action: Action,
  now: Clock,
): GameFrame =>
  match(action)
    .with({ type: 'TICK' }, (): GameFrame => ({
      previous: frame.current,
      current: nextGameState(frame.current, action, now),
    }))
    .otherwise((): GameFrame => ({
      previous: frame.previous,
      current: nextGameState(frame.current, action, now),
    }));
