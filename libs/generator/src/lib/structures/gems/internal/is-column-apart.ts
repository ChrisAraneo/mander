import { every } from 'lodash-es';
import { GEM_GAP } from '../../../consts';
import type { Spot } from '../../find-standing-spots';

export const isColumnApart = (picked: Spot[], candidate: Spot) =>
  every(picked, ({ column }) => Math.abs(column - candidate.column) >= GEM_GAP);
