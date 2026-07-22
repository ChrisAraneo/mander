import { fill, times } from 'lodash-es';
import { AIR, SECTOR_WIDTH, STRUCTURE_HEIGHT, type Structure } from '@mander/generator';

export function airGrid(): Structure {
  return times(STRUCTURE_HEIGHT, () => fill(new Array(SECTOR_WIDTH), AIR));
}
