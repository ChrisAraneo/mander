import { createRecordingProxy } from './internal/create-recording-proxy';
import type { CanvasCall } from './types/canvas-call';
import type { RecordingContext } from './types/recording-context';

const toRecordingContext = (calls: CanvasCall[]): RecordingContext => ({
  calls,
  context: createRecordingProxy(calls),
});

export const createRecordingContext = (): RecordingContext =>
  toRecordingContext([]);
