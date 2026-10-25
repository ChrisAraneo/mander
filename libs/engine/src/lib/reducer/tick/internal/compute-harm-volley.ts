import { computeVolley } from '../../bullet/compute-volley';
import type { Volley } from '../../bullet/types/volley';
import { patchStruckEnemies } from './patch-struck-enemies';
import type { TickHarm } from './types/tick-harm';

export const computeHarmVolley = ({
  state,
  fallingSpikes,
  flyingBullets,
  afterStomps,
  gored,
}: TickHarm): Volley =>
  computeVolley(
    flyingBullets,
    patchStruckEnemies(afterStomps, gored),
    fallingSpikes,
    state.level,
  );
