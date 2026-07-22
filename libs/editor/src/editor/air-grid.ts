import {
  AIR,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { fill, times } from 'lodash-es';

export function airGrid(): Structure {
  return times(STRUCTURE_HEIGHT, () => fill(new Array(SECTOR_WIDTH), AIR));
}
