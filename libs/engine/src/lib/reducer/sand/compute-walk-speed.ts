import type { Level } from '@mander/model';
import { match } from 'ts-pattern';
import { SAND_MOVE_FACTOR } from './consts';
import { isWalkingOnSand } from './internal/is-walking-on-sand';
import type { Walker } from './types/walker';

export const computeWalkSpeed = (
  level: Level,
  walker: Walker,
  width: number,
  height: number,
  speed: number,
): number =>
  match(isWalkingOnSand(level, walker, width, height))
    .with(true, () => speed * SAND_MOVE_FACTOR)
    .otherwise(() => speed);
