import { map, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { createRecordingContext } from './create-recording-context';
import { formatCanvasCall } from './internal/format-canvas-call';

export const drawRecorded = (
  draw: (context: CanvasRenderingContext2D) => unknown,
): string[] =>
  pipe(
    createRecordingContext(),
    (recording) => tap(recording, ({ context }) => draw(context)),
    ({ calls }) => map(calls, formatCanvasCall),
  );
