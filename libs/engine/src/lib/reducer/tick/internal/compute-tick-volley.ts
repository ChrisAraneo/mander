import { computeHarmVolley } from './compute-harm-volley';
import { createTickVolley } from './create-tick-volley';
import type { TickHarm } from './types/tick-harm';
import type { TickVolley } from './types/tick-volley';

export const computeTickVolley = (harm: TickHarm): TickVolley =>
  createTickVolley(harm, computeHarmVolley(harm));
