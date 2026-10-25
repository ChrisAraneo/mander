import { toRecordingContext } from './internal/to-recording-context';
import type { RecordingContext } from './types/recording-context';

export const createRecordingContext = (): RecordingContext =>
  toRecordingContext([]);
