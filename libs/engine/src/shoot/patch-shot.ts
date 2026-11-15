import { match, P } from 'ts-pattern';
import { isAlive } from '../player/is-alive';
import type { GameState } from '../state/types/game-state';
import { patchFiredBullet } from './internal/patch-fired-bullet';

const { number } = P;

export const patchShot = (state: GameState): GameState =>
  match({
    status: state.status,
    isAlive: isAlive(state.player),
    ammo: state.ammo,
  })
    .with({ status: 'PLAYING', isAlive: true, ammo: number.gte(1) }, () =>
      patchFiredBullet(state),
    )
    .otherwise(() => state);
