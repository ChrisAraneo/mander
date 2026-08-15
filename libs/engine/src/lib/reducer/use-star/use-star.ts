import type { Player } from '@mander/model';
import { match, P } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { isAlive } from '../player/is-alive';
import { STAR_INVINCIBLE_SECONDS } from '../player/consts';

const shielded = (player: Player): Player => ({
  ...player,
  timers: {
    ...player.timers,
    invincibility: Math.max(
      player.timers.invincibility,
      STAR_INVINCIBLE_SECONDS,
    ),
  },
});

const burnStar = (state: GameState): GameState => ({
  ...state,
  stars: state.stars - 1,
  player: shielded(state.player),
});

export const useStar = (state: GameState): GameState =>
  match({
    status: state.status,
    alive: isAlive(state.player),
    stars: state.stars,
  })
    .with(
      { status: 'PLAYING', alive: true, stars: P.number.gte(1) },
      (): GameState => burnStar(state),
    )
    .otherwise((): GameState => state);
