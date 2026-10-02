import { STRUCTURE_HEIGHT } from '@mander/structures';
import { map, max } from 'lodash-es';
import type { Placement } from './placement';

export const computeJoinedHeight = (placements: Placement[]): number =>
  max(map(placements, (placement) => placement.row + STRUCTURE_HEIGHT)) ?? 0;
