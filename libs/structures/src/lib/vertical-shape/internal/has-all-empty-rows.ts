import { every } from 'lodash-es';
import type { Layer } from '../../types/layer';
import { isEmptyCell } from './is-empty-cell';

export const hasAllEmptyRows = (
  structure: Layer,
  rows: readonly number[],
): boolean => every(rows, (row) => every(structure[row], isEmptyCell));
