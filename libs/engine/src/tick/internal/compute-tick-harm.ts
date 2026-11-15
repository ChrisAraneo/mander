import { pipe } from 'remeda';
import { computeTickOutcome } from './compute-tick-outcome';
import { computeTickVictims } from './compute-tick-victims';
import { createTickHarm } from './create-tick-harm';
import type { TickHarm } from './types/tick-harm';
import type { TickStomps } from './types/tick-stomps';

export const computeTickHarm = (stomps: TickStomps): TickHarm =>
  pipe(stomps, computeTickVictims, computeTickOutcome, createTickHarm);
