import type { Level } from '@mander/model';
import type { Walker } from '../types/walker';
import { computeSandProbeRow } from './compute-sand-probe-row';
import { isSandUnderWalker } from './is-sand-under-walker';

export const isWalkingOnSand = (
  level: Level,
  { position, statuses }: Walker,
  width: number,
  height: number,
): boolean =>
  statuses.isGrounded &&
  isSandUnderWalker(
    level,
    position.x,
    width,
    computeSandProbeRow(position.y, height),
  );
