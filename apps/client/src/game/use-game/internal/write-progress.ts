import type { GameState } from '@mander/engine';
import { match } from 'ts-pattern';
import { writeScore } from '../../storage';
import type { Game } from '../types/game';
import { shouldWriteScore } from './should-write-score';

export const writeProgress = (
  game: Game,
  previous: GameState,
  next: GameState,
): boolean =>
  match(shouldWriteScore(game.world, previous, next))
    .with(true, () => writeScore(next.score, game.storage))
    .otherwise(() => false);
