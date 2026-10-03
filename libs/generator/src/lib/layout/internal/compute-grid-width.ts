import { STRUCTURE_WIDTH } from '@mander/structures';
import { map, max } from 'lodash-es';
import type { Placement } from './placement';

export const computeGridWidth = (placements: Placement[]): number =>
  max(map(placements, (placement) => placement.column + STRUCTURE_WIDTH)) ?? 0;
