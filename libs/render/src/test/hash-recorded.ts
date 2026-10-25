import { hashString } from '@mander/engine';
import { join, size } from 'lodash-es';
import { pipe } from 'remeda';
import { drawRecorded } from './draw-recorded';

export const hashRecorded = (
  draw: (context: CanvasRenderingContext2D) => unknown,
): string =>
  pipe(
    draw,
    drawRecorded,
    (calls) => `${size(calls)}:${hashString(join(calls, '\n'))}`,
  );
