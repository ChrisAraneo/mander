import { every } from 'lodash-es';
import { GEM_GAP } from '../../consts';
import type { Spot } from '../../types/spot';

export const isSpotApart = (picked: Spot[], candidate: Spot): boolean =>
  every(
    picked,
    ({ row, column }) =>
      Math.abs(row - candidate.row) >= GEM_GAP ||
      Math.abs(column - candidate.column) >= GEM_GAP,
  );
