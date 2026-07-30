import {
  AIR,
  BLOCK,
  SECTOR_WIDTH,
  STRUCTURE_HEIGHT,
  type Structure,
} from '@mander/generator';
import { map, range, times } from 'lodash-es';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

export const createGrid = (): Structure =>
  map(range(STRUCTURE_HEIGHT), (row) =>
    times(SECTOR_WIDTH, () => (row === GROUND_ROW ? BLOCK : AIR)),
  );
