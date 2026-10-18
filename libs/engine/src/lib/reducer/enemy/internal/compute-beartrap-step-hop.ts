import { chain } from '@mander/model';
import { computeBeartrapHop } from './compute-beartrap-hop';
import type { BeartrapStepDelta } from './types/beartrap-step-delta';
import type { BeartrapStepIntent } from './types/beartrap-step-intent';

export const computeBeartrapStepHop = ({
  level,
  trap,
  player,
  deltaSeconds,
}: BeartrapStepDelta): BeartrapStepIntent =>
  chain(
    computeBeartrapHop(
      trap.statuses.isGrounded,
      trap.velocity.y.current,
      trap,
      player,
    ),
  )
    .thru((hop): BeartrapStepIntent => ({
      level,
      trap,
      deltaSeconds,
      velocityY: hop.velocityY,
      isGrounded: hop.isGrounded,
    }))
    .value();
