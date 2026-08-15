import type { Level } from '@mander/model';

import type { MovePlan } from './move-plan';

export interface Flight {
  tiles: Level;
  plan: MovePlan;
}
