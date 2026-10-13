import { clamp } from 'lodash-es';

export const computeClampedIndex = (index: number, edge: number): number =>
  clamp(index, 0, edge);
