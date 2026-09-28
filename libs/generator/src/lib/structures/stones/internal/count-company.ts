import { sum } from 'lodash-es';
import type { Field } from './field';

export const countCompany = (
  blobs: Field,
  row: number,
  column: number,
): number =>
  sum([
    blobs[row - 1]?.[column] ?? 0,
    blobs[row + 1]?.[column] ?? 0,
    blobs[row][column - 1] ?? 0,
    blobs[row][column + 1] ?? 0,
  ]);
