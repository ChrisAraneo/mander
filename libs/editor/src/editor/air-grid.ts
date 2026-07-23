import {
  AIR,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { times } from 'lodash-es';

export const airGrid = (): Structure =>
  times(STRUCTURE_HEIGHT, () =>
    Array.from({ length: SECTOR_WIDTH }, (): number => AIR),
  );
