import type { FallingSpike } from '@mander/model';
import { filter } from 'lodash-es';
import type { Volley } from '../types/volley';

export const removeVolleyFallingSpike = (
  volley: Volley,
  target: FallingSpike,
): Volley => ({
  ...volley,
  fallingSpikes: filter(volley.fallingSpikes, (spike) => spike !== target),
});
