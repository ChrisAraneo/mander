import { times, floor } from 'lodash-es';

const HILL_STEP = 16;

export const computeHillStepsAcross = (width: number): number[] =>
  times(floor(width / HILL_STEP) + 1, (index) => index * HILL_STEP);
