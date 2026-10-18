import type { Level } from '@mander/model';
import type { MovePlan } from './move-plan';

export interface Flight {
  level: Level;
  plan: MovePlan;
}
