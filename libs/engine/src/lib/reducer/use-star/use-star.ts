import type { Item, Player } from '@mander/model';
import { filter, findIndex } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { isAlive } from '../player/is-alive';
import { STAR_INVINCIBLE_SECONDS } from '../player/consts';
import { isStar } from './is-star';

const withoutIndex = (inventory: Item[], index: number): Item[] =>
  filter(inventory, (_, at) => at !== index);

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

const burnStar = (state: GameState, index: number): GameState => ({
  ...state,
  inventory: withoutIndex(state.inventory, index),
  player: shielded(state.player),
});

export const useStar = (state: GameState): GameState =>
  match({
    status: state.status,
    alive: isAlive(state.player),
    index: findIndex(state.inventory, isStar),
  })
    .with(
      { status: 'PLAYING', alive: true, index: P.number.gte(0) },
      ({ index }): GameState => burnStar(state, index),
    )
    .otherwise((): GameState => state);
