import { every } from 'lodash-es';
import { GEM_GAP } from '../../../consts';
import type { Spot } from '../../types/spot';

export const isColumnApart = (picked: Spot[], candidate: Spot): boolean =>
  every(picked, ({ column }) => Math.abs(column - candidate.column) >= GEM_GAP);
