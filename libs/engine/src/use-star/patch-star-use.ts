import { match, P } from 'ts-pattern';
import { isAlive } from '../player/is-alive';
import type { GameState } from '../state/types/game-state';
import { patchSpentStar } from './internal/patch-spent-star';

const { number } = P;

export const patchStarUse = (state: GameState): GameState =>
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
