import { match } from 'ts-pattern';
import { patchStompBounce } from './patch-stomp-bounce';
import type { TickBounce } from './types/tick-bounce';
import type { TickHazards } from './types/tick-hazards';

export const computeTickBounce = ({
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
