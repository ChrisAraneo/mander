import { TILE_AIR } from '@mander/model';
import { includes } from 'lodash-es';
import { STRUCTURE_END, STRUCTURE_START } from '../../consts';

const MARKERS: readonly number[] = [STRUCTURE_START, STRUCTURE_END];

export const isEmptyCell = (cell: number): boolean =>
  cell === TILE_AIR || includes(MARKERS, cell);
