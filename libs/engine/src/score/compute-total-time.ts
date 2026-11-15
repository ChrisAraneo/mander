import { sum } from 'lodash-es';

export const computeTotalTime = (levelTimes: number[]): number =>
  sum(levelTimes);
