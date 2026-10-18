import type { Cannon } from '@mander/model';
import { clamp } from 'lodash-es';

const CHARGE_SECONDS = 0.7;

export const computeCannonCharge = (cannon: Cannon): number =>
  clamp(1 - cannon.timers.reload / CHARGE_SECONDS, 0, 1);
