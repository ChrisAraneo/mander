import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { createFireballs } from '../../fireball/create-fireballs';
import type { GameState } from '../../state/types/game-state';
import { createReloadedBarrage } from './create-reloaded-barrage';
import { createTickHazardSet } from './create-tick-hazard-set';
import type { TickHazardSet } from './types/tick-hazard-set';

export const createRespawnedTickHazards = (state: GameState): TickHazardSet =>
  createTickHazardSet(
    createEnemies(state.level),
    createReloadedBarrage(state.level),
    [],
    createFallingSpikes(state.level),
    createFireballs(state.level),
    [],
  );
