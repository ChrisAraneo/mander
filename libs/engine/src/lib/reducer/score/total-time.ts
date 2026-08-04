import { sum } from 'lodash-es';

export const totalTime = (levelTimes: number[]): number => sum(levelTimes);
