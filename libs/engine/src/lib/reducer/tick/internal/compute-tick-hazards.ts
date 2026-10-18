import { chain } from '@mander/model';
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
}: TickPlayer): TickHazards =>
  chain(
    match(hasRespawned)
      .with(true, () => createRespawnedTickHazards(state, moved))
      .otherwise(() => patchMovedTickHazards(state, moved, deltaSeconds)),
  )
    .thru((hazards): TickHazards => ({
      state,
      deltaSeconds,
      moved,
      isPlayerAlive,
      steppedEnemies: hazards.steppedEnemies,
      cannons: hazards.cannons,
      flying: hazards.flying,
      fallingSpikes: hazards.fallingSpikes,
      fireballs: hazards.fireballs,
      playerFireballs: hazards.playerFireballs,
      flyingBullets: hazards.flyingBullets,
    }))
    .value();
