import type { Enemy } from '@mander/model';
import type { FreezingShot } from './types/freezing-shot';

export const createHeldFreezingShot = (freezer: Enemy): FreezingShot => ({
  enemy: freezer,
  snowball: undefined,
});
