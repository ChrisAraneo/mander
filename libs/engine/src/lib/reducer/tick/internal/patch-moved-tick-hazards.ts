import { type Player } from '@mander/model';
import type { GameState } from '../../../types/game-state';
import { nextBullets } from '../../bullet/next-bullets';
import { nextFallingSpikes } from '../../falling-spike/next-falling-spikes';
import { nextFireballs } from '../../fireball/next-fireballs';
import { createTickHazardSet } from './create-tick-hazard-set';
import { patchMovedBarrage } from './patch-moved-barrage';
import { patchMovedEnemies } from './patch-moved-enemies';
import type { TickHazardSet } from './types/tick-hazard-set';

export const patchMovedTickHazards = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): TickHazardSet =>
  createTickHazardSet(
    patchMovedEnemies(state, player, deltaSeconds),
    patchMovedBarrage(state, player, deltaSeconds),
    nextFallingSpikes(state.level, state.fallingSpikes, player, deltaSeconds),
    nextFireballs(state.fireballs, deltaSeconds),
    nextBullets(state.level, state.bullets, deltaSeconds),
  );
