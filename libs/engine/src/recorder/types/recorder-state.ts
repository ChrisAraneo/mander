import type { RecordedAction } from './recorded-action';

export interface RecorderState {
  worldName: string;
  entries: RecordedAction[];
  step: number;
  isRecording: boolean;
}
