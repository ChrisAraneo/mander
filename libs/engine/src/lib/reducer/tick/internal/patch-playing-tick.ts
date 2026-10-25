import { pipe } from 'remeda';
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
  pipe(
    { state, deltaSeconds },
    computeTickPlayer,
    computeTickHazards,
    computeTickStomps,
    computeTickHarm,
    computeTickVolley,
    computeTickEntities,
    patchTickState,
  );
