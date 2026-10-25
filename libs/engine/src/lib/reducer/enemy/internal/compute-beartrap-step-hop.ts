import { computeBeartrapHop } from './compute-beartrap-hop';
import type { BeartrapStepDelta } from './types/beartrap-step-delta';
import type { BeartrapStepIntent } from './types/beartrap-step-intent';

export const computeBeartrapStepHop = ({
  level,
  trap,
  player,
  deltaSeconds,
}: BeartrapStepDelta): BeartrapStepIntent => ({
  level,
  trap,
  deltaSeconds,
  ...computeBeartrapHop(
    trap.statuses.isGrounded,
    trap.velocity.y.current,
    trap,
    player,
  ),
});
