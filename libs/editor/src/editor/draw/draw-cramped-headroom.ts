import type { Structure } from '@mander/generator';
import {
  STRUCTURE_HEIGHT,
  PLAYER_CLEARANCE,
  surfaceHasHeadroom,
} from '@mander/generator';
import { forEach } from 'lodash-es';
import { match } from 'ts-pattern';
import { COLORS, CELL } from '../../constants';
import type { Surfaces } from '../types/surfaces';

export const drawCrampedHeadroom = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  surfaces: Surfaces,
): void => {
  context.fillStyle = COLORS.cramped;
  forEach(surfaces, (surface) =>
    match(surfaceHasHeadroom(grid, surface))
      .with(true, () => undefined)
      .otherwise(() => {
        const row = STRUCTURE_HEIGHT - 1 - surface.height;
        context.fillRect(
          surface.col * CELL,
          (row - PLAYER_CLEARANCE) * CELL,
          CELL,
          PLAYER_CLEARANCE * CELL,
        );
      }),
  );
};
