import type { CannonKind } from '@mander/model';
import { match } from 'ts-pattern';
import {
  CANNON_RELOAD_SECONDS,
  CANNON_RESTING_ANGLE,
  TRIPLE_CANNON_RELOAD_SECONDS,
  TRIPLE_CANNON_SHOT_GAP_SECONDS,
  TRIPLE_CANNON_SPREAD_RADIANS,
} from '../consts';
import type { CannonRound } from './types/cannon-round';

const REGULAR_ROUNDS: readonly CannonRound[] = Object.freeze([
  { angle: CANNON_RESTING_ANGLE, reloadSeconds: CANNON_RELOAD_SECONDS },
]);

const TRIPLE_ROUNDS: readonly CannonRound[] = Object.freeze([
  {
    angle: -TRIPLE_CANNON_SPREAD_RADIANS,
    reloadSeconds: TRIPLE_CANNON_SHOT_GAP_SECONDS,
  },
  {
    angle: CANNON_RESTING_ANGLE,
    reloadSeconds: TRIPLE_CANNON_SHOT_GAP_SECONDS,
  },
  {
    angle: TRIPLE_CANNON_SPREAD_RADIANS,
    reloadSeconds:
      TRIPLE_CANNON_RELOAD_SECONDS - TRIPLE_CANNON_SHOT_GAP_SECONDS * 2,
  },
]);

export const getCannonRounds = (kind: CannonKind): readonly CannonRound[] =>
  match(kind)
    .with('REGULAR', () => REGULAR_ROUNDS)
    .with('TRIPLE', () => TRIPLE_ROUNDS)
    .exhaustive();
