import type { Action } from '../../../actions/actions';
import type { Replay } from './replay';

export interface Recorder {
  record(action: Action, timestampMs: number): void;
  stop(): void;
  reset(): void;
  snapshot(): Replay;
}
