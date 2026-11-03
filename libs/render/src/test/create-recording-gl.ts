import { pipe } from 'remeda';
import { createRecordingGlProxy } from './internal/create-recording-gl-proxy';
import type { CanvasCall } from './types/canvas-call';
import type { RecordingGl } from './types/recording-gl';
import type { RecordingGlOptions } from './types/recording-gl-options';

export const createRecordingGl = (
  options: RecordingGlOptions = {},
): RecordingGl =>
  pipe([] as CanvasCall[], (calls) => ({
    calls,
    gl: createRecordingGlProxy(calls, options),
  }));
