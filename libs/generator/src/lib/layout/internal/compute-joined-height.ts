import { STRUCTURE_HEIGHT } from '@mander/structures';
import { map, max } from 'lodash-es';
import type { StructurePlacement } from './types/structure-placement';

export const computeJoinedHeight = (placements: StructurePlacement[]): number =>
  max(map(placements, (placement) => placement.row + STRUCTURE_HEIGHT)) ?? 0;
