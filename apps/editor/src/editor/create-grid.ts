import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_WIDTH, STRUCTURE_HEIGHT } from '@mander/structures';
import { map, range, times } from 'lodash-es';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

export const createGrid = (): number[][] =>
  map(range(STRUCTURE_HEIGHT), (row) =>
    times(STRUCTURE_WIDTH, () => (row === GROUND_ROW ? TILE_DIRT : TILE_AIR)),
  );
