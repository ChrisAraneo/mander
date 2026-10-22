import { round, size, take } from 'lodash-es';
import type { FireballCells } from './types/fireball-cells';
import type { FireballSlice } from './types/fireball-slice';

export const sliceFireballCells = ({
  tiles,
  rate,
  cells,
}: FireballCells): FireballSlice => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});
