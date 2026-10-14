import { STRUCTURE_WIDTH } from '@mander/structures';
import { map, max } from 'lodash-es';
import type { StructurePlacement } from './types/structure-placement';

export const computeGridWidth = (placements: StructurePlacement[]): number =>
  max(map(placements, (placement) => placement.column + STRUCTURE_WIDTH)) ?? 0;
