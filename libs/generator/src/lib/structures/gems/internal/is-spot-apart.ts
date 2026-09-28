import { every } from 'lodash-es';
import { GEM_GAP } from '../../../consts';
import type { Spot } from '../../find-standing-spots';

export const isSpotApart = (picked: Spot[], candidate: Spot) =>
  every(
    picked,
    ({ row, column }) =>
      Math.abs(row - candidate.row) >= GEM_GAP ||
      Math.abs(column - candidate.column) >= GEM_GAP,
  );
