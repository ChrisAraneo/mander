import { computeHarmVolley } from './compute-harm-volley';
import { createTickVolley } from './create-tick-volley';
import type { TickHarm } from './types/tick-harm';
import type { TickVolley } from './types/tick-volley';

export const computeTickVolley = ({
  fallingSpikes,
  flyingBullets,
  afterStomps,
  gored,
  ...harm
}: TickHarm): TickVolley =>
  createTickVolley(
    harm,
    computeHarmVolley({
      ...harm,
      fallingSpikes,
      flyingBullets,
      afterStomps,
      gored,
    }),
  );
