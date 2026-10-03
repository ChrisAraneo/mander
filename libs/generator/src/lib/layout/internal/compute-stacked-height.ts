import { VERTICAL_HEIGHT } from '@mander/structures';
import { map, max } from 'lodash-es';
import { VERTICAL_GROUND_DEPTH } from '../../consts';
import type { Placement } from './placement';

export const computeStackedHeight = (placements: Placement[]): number =>
  max(
    map(
      placements,
      (placement) => placement.row + VERTICAL_HEIGHT + VERTICAL_GROUND_DEPTH,
    ),
  ) ?? 0;
