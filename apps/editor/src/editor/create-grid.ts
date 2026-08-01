import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '@mander/structures';
import { map, range, times } from 'lodash-es';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

export const createGrid = (): number[][] =>
  map(range(STRUCTURE_HEIGHT), (row) =>
    times(SECTOR_WIDTH, () => (row === GROUND_ROW ? TILE_DIRT : TILE_AIR)),
  );
