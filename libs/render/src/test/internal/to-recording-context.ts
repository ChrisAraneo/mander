import type { CanvasCall } from '../types/canvas-call';
import type { RecordingContext } from '../types/recording-context';
import { createRecordingProxy } from './create-recording-proxy';

export const toRecordingContext = (calls: CanvasCall[]): RecordingContext => ({
  calls,
  context: createRecordingProxy(calls),
});
