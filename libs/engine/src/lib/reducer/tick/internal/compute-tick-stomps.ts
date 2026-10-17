import { chain } from '@mander/utils';
import { match } from 'ts-pattern';
import { patchStompBounce } from './patch-stomp-bounce';
import type { TickBounce } from './types/tick-bounce';
import type { TickHazards } from './types/tick-hazards';
import type { TickStomps } from './types/tick-stomps';

export const computeTickStomps = ({
  state,
  deltaSeconds,
  moved,
  isPlayerAlive,
  steppedEnemies,
  cannons,
  flying,
  fallingSpikes,
  fireballs,
  playerFireballs,
  flyingBullets,
}: TickHazards): TickStomps =>
  chain(
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
      })),
  )
    .thru((bounce): TickStomps => ({
      state,
      deltaSeconds,
      isPlayerAlive,
      cannons,
      flying,
      fallingSpikes,
      fireballs,
      playerFireballs,
      flyingBullets,
      bounced: bounce.player,
      afterStomps: bounce.enemies,
    }))
    .value();
