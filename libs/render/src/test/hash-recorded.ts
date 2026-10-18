import { hashString } from '@mander/engine';
import { chain } from '@mander/model';
import { join, size } from 'lodash-es';
import { drawRecorded } from './draw-recorded';

export const hashRecorded = (
  draw: (context: CanvasRenderingContext2D) => unknown,
): string =>
  chain(drawRecorded(draw))
    .thru((calls) => `${size(calls)}:${hashString(join(calls, '\n'))}`)
    .value();
