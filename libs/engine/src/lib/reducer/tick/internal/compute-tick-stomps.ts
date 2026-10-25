import { computeTickBounce } from './compute-tick-bounce';
import { createTickStomps } from './create-tick-stomps';
import type { TickHazards } from './types/tick-hazards';
import type { TickStomps } from './types/tick-stomps';

export const computeTickStomps = (hazards: TickHazards): TickStomps =>
  createTickStomps(hazards, computeTickBounce(hazards));
