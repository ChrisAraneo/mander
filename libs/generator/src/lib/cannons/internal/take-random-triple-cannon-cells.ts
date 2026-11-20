import { isRollUnder } from '@mander/common';
import { filter } from 'lodash-es';
import type { CannonSlice } from './types/cannon-slice';
import type { TripleCannonCells } from './types/triple-cannon-cells';

const TRIPLE_CANNON_CHANCE = 0.5;

export const takeRandomTripleCannonCells = ({
  tiles,
  random,
  cells,
}: TripleCannonCells): CannonSlice => ({
  tiles,
  cells: filter(cells, () => isRollUnder(TRIPLE_CANNON_CHANCE, random)),
});
