import type { RecordedAction } from './recorded-action';

export interface Replay {
  worldName: string;
  startedAtMs: number;
  entries: RecordedAction[];
}
