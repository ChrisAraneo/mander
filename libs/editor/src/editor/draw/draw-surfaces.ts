import type { ReachMap } from '@mander/engine';
import { isReachableSurface, STRUCTURE_HEIGHT } from '@mander/generator';
import { forEach } from 'lodash-es';
import { match } from 'ts-pattern';
import { CELL, COLORS } from '../../constants';
import type { Surfaces } from '../types/surfaces';

export const drawSurfaces = (
  context: CanvasRenderingContext2D,
  surfaces: Surfaces,
  reach: ReachMap,
): void => {
  forEach(surfaces, (surface) => {
    const row = STRUCTURE_HEIGHT - 1 - surface.height;
    context.fillStyle = match(isReachableSurface(reach, surface))
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
