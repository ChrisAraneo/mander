import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '@mander/generator';
import { floor } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Cell } from '../types/cell';

export const cellAt = (
  canvas: HTMLCanvasElement,
  event: PointerEvent,
): Cell | null => {
  const rect = canvas.getBoundingClientRect();
  const column = floor(
    ((event.clientX - rect.left) / rect.width) * SECTOR_WIDTH,
  );
  const row = floor(
    ((event.clientY - rect.top) / rect.height) * STRUCTURE_HEIGHT,
  );

  return match(
    column >= 0 && column < SECTOR_WIDTH && row >= 0 && row < STRUCTURE_HEIGHT,
  )
    .with(true, (): Cell | null => ({ row, column }))
    .otherwise(() => null);
};
