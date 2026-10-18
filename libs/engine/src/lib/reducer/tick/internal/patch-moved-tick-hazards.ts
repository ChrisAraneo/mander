import { type Player, chain } from '@mander/model';
import type { GameState } from '../../../types/game-state';
import { advanceBullets } from '../../bullet/advance-bullets';
import { advanceFallingSpikes } from '../../falling-spike/advance-falling-spikes';
import { advanceFireballs } from '../../fireball/advance-fireballs';
import { patchMovedBarrage } from './patch-moved-barrage';
import { patchMovedEnemies } from './patch-moved-enemies';
import type { TickHazardSet } from './types/tick-hazard-set';

export const patchMovedTickHazards = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): TickHazardSet =>
  chain({
    steppedEnemies: patchMovedEnemies(state, player, deltaSeconds),
    barrage: patchMovedBarrage(state, player, deltaSeconds),
  })
    .thru(({ steppedEnemies, barrage }): TickHazardSet => ({
      steppedEnemies,
      cannons: barrage.cannons,
      flying: barrage.cannonballs,
      fallingSpikes: advanceFallingSpikes(
        state.level,
        state.fallingSpikes,
        player,
        deltaSeconds,
      ),
      fireballs: advanceFireballs(state.fireballs, deltaSeconds),
      flyingBullets: advanceBullets(state.level, state.bullets, deltaSeconds),
    }))
    .value();
