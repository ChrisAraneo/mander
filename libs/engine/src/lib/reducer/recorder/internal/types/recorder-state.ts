import type { RecordedAction } from '../../types/recorded-action';

export interface RecorderState {
  entries: RecordedAction[];
  step: number;
  isRecording: boolean;
}
