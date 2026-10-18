import { chain, tapEffect } from '@mander/utils';
import { map } from 'lodash-es';
import { createRecordingContext } from './create-recording-context';
import { formatCanvasCall } from './internal/format-canvas-call';

export const drawRecorded = (
  draw: (context: CanvasRenderingContext2D) => unknown,
): string[] =>
  chain(createRecordingContext())
    .thru((recording) => tapEffect(recording, ({ context }) => draw(context)))
    .thru(({ calls }) => map(calls, formatCanvasCall))
    .value();
