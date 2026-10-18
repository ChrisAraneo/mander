import { match, P } from 'ts-pattern';
import type { GameState } from '../../types/game-state';
import { isAlive } from '../player/is-alive';
import { patchSpentStar } from './internal/patch-spent-star';

const { number } = P;

export const useStar = (state: GameState): GameState =>
  match({
    status: state.status,
    isAlive: isAlive(state.player),
    stars: state.stars,
  })
    .with(
      { status: 'PLAYING', isAlive: true, stars: number.gte(1) },
      (): GameState => patchSpentStar(state),
    )
    .otherwise((): GameState => state);
