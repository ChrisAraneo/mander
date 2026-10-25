import { match } from 'ts-pattern';
import { patchStompBounce } from './patch-stomp-bounce';
import type { TickBounce } from './types/tick-bounce';
import type { TickHazards } from './types/tick-hazards';
import type { TickStomps } from './types/tick-stomps';

const computeTickBounce = ({
  state,
  deltaSeconds,
  moved,
  isPlayerAlive,
  steppedEnemies,
}: TickHazards): TickBounce =>
  match(isPlayerAlive)
    .with(true, () =>
      patchStompBounce(
        state.player,
        moved,
        steppedEnemies,
        state.input.isJump,
        deltaSeconds,
      ),
    )
    .otherwise((): TickBounce => ({
      player: moved,
      enemies: steppedEnemies,
    }));

const createTickStomps = (
  {
    state,
    deltaSeconds,
    isPlayerAlive,
    cannons,
    flying,
    fallingSpikes,
    fireballs,
    flyingBullets,
  }: TickHazards,
  { player, enemies }: TickBounce,
): TickStomps => ({
  state,
  deltaSeconds,
  isPlayerAlive,
  cannons,
  flying,
  fallingSpikes,
  fireballs,
  flyingBullets,
  bounced: player,
  afterStomps: enemies,
});

export const computeTickStomps = (hazards: TickHazards): TickStomps =>
  createTickStomps(hazards, computeTickBounce(hazards));
