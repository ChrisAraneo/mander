import type { RecordedAction } from './recorded-action';

export interface Replay {
  worldName: string;
  steps: number;
  entries: RecordedAction[];
}
