import { isRollUnder, type Random } from '@mander/engine';
import { filter } from 'lodash-es';
import type { Cell } from '../../types/cell';

const TRIPLE_CANNON_CHANCE = 0.5;

export const takeRandomTripleCannonCells = (
  cells: Cell[],
  random: Random,
): Cell[] => filter(cells, () => isRollUnder(TRIPLE_CANNON_CHANCE, random));
