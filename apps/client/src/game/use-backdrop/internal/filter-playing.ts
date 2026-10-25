import type { GameState } from '@mander/engine';
import { match } from 'ts-pattern';

export const filterPlaying = (idle: GameState, next: GameState): GameState =>
  match(next.status)
    .with('PLAYING', () => next)
    .otherwise(() => idle);
