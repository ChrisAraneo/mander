import { flow } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { computeTickEntities } from './compute-tick-entities';
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVolley } from './compute-tick-volley';
import { patchTickState } from './patch-tick-state';

export const patchPlayingTick = (
  state: GameState,
  deltaSeconds: number,
): GameState =>
  flow(
    computeTickPlayer,
    computeTickHazards,
    computeTickStomps,
    computeTickHarm,
    computeTickVolley,
    computeTickEntities,
    patchTickState,
  )({ state, deltaSeconds });
