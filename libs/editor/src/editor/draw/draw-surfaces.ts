import { STRUCTURE_HEIGHT } from '@mander/generator';
import { forEach } from 'lodash-es';
import { match } from 'ts-pattern';
import { CELL, COLORS } from '../../constants';
import type { reachableFromEntry } from '../reachable-from-entry';

type Surfaces = ReturnType<typeof reachableFromEntry>['surfaces'];

export const drawSurfaces = (
  context: CanvasRenderingContext2D,
  surfaces: Surfaces,
  reached: boolean[],
): void => {
  forEach(surfaces, (surface, surfaceIndex) => {
    const row = STRUCTURE_HEIGHT - 1 - surface.height;
    context.fillStyle = match(reached[surfaceIndex])
      .with(true, () => COLORS.reachable)
      .otherwise(() => COLORS.stranded);
    context.beginPath();
    context.arc(
      surface.col * CELL + CELL / 2,
      row * CELL + 7,
      3.5,
      0,
      Math.PI * 2,
    );
    context.fill();
  });
};
