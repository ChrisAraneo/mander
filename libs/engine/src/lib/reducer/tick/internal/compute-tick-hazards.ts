import { match } from 'ts-pattern';
import { createRespawnedTickHazards } from './create-respawned-tick-hazards';
import { patchMovedTickHazards } from './patch-moved-tick-hazards';
import type { TickHazards } from './types/tick-hazards';
import type { TickPlayer } from './types/tick-player';

export const computeTickHazards = ({
  state,
  deltaSeconds,
  moved,
  hasRespawned,
  isPlayerAlive,
}: TickPlayer): TickHazards => ({
  state,
  deltaSeconds,
  moved,
  isPlayerAlive,
  ...match(hasRespawned)
    .with(true, () => createRespawnedTickHazards(state))
    .otherwise(() => patchMovedTickHazards(state, moved, deltaSeconds)),
});
