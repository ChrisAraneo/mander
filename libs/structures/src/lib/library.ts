import { HARD_01 } from './hard';
import {
  NORMAL_01,
  NORMAL_02,
  NORMAL_03,
  NORMAL_04,
  NORMAL_05,
} from './normal';
import type { Structure } from './structure';

export const NORMAL_STRUCTURES: readonly Structure[] = Object.freeze([
  NORMAL_01,
  NORMAL_02,
  NORMAL_03,
  NORMAL_04,
  NORMAL_05,
]);

export const HARD_STRUCTURES: readonly Structure[] = Object.freeze([HARD_01]);
