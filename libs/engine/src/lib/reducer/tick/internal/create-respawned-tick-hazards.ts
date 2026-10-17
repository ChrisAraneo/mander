import type { Player } from '@mander/model';
import { chain } from '@mander/utils';
import type { GameState } from '../../../types/game-state';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { createFireballs } from '../../fireball/create-fireballs';
import { createPlayerFireballs } from '../../fireball/create-player-fireballs';
import { createReloadedBarrage } from './create-reloaded-barrage';
import type { TickHazardSet } from './types/tick-hazard-set';

export const createRespawnedTickHazards = (
  state: GameState,
  player: Player,
): TickHazardSet =>
  chain({
    steppedEnemies: createEnemies(state.level),
    barrage: createReloadedBarrage(state.level),
  })
    .thru(({ steppedEnemies, barrage }): TickHazardSet => ({
      steppedEnemies,
      cannons: barrage.cannons,
      flying: barrage.cannonballs,
      fallingSpikes: createFallingSpikes(state.level),
      fireballs: createFireballs(state.level),
      playerFireballs: createPlayerFireballs(
        state.inventory,
        player,
        state.isMoonMagnetOn,
      ),
      flyingBullets: [],
    }))
    .value();
