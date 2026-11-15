import { match } from 'ts-pattern';
import type { Sweep } from './types/sweep';

export const getSweepOrigin = ({ axis, originX, originY }: Sweep): number =>
  match(axis)
    .with('HORIZONTAL', () => originX)
    .with('VERTICAL', () => originY)
    .exhaustive();
