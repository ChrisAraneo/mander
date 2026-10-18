import { chain } from '@mander/model';
import { map, tap } from 'lodash-es';
import { createRecordingContext } from './create-recording-context';
import { formatCanvasCall } from './internal/format-canvas-call';

export const drawRecorded = (
  draw: (context: CanvasRenderingContext2D) => unknown,
): string[] =>
  chain(createRecordingContext())
    .thru((recording) => tap(recording, ({ context }) => draw(context)))
    .thru(({ calls }) => map(calls, formatCanvasCall))
    .value();
