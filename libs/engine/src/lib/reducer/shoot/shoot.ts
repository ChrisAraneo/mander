import { concat } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { fireBullet } from '../bullet/fire-bullet';
import { isAlive } from '../player/is-alive';

export const shoot = (state: GameState): GameState =>
  match({
    status: state.status,
    alive: isAlive(state.player),
    ammo: state.ammo,
  })
    .with(
      { status: 'PLAYING', alive: true, ammo: P.number.gte(1) },
      (): GameState => ({
        ...state,
        ammo: state.ammo - 1,
        bullets: concat(state.bullets, fireBullet(state.player)),
      }),
    )
    .otherwise((): GameState => state);
