import { match } from 'ts-pattern';
import type { Sweep } from './types/sweep';

export const getSweepSize = ({ axis, width, height }: Sweep): number =>
  match(axis)
    .with('HORIZONTAL', () => width)
    .with('VERTICAL', () => height)
    .exhaustive();
