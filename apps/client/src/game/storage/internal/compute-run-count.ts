import { match, P } from 'ts-pattern';
import type { PlayedWorld } from '../types/played-world';

const { nullish } = P;

export const computeRunCount = (previous: PlayedWorld | undefined): number =>
  match(previous)
    .with(nullish, () => 1)
    .otherwise((earlier) => earlier.runs + 1);
