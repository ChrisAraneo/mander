import type { Action } from '../../types/action';
import type { Replay } from './replay';

export interface Recorder {
  record(action: Action): void;
  stop(): void;
  reset(): void;
  snapshot(): Replay;
}
