import type { CompletedWorld } from './completed-world';
import type { RunRecord } from './run-record';

export interface PlayableWorld {
  name: string;
  day: string;
  playedAt: string;
  runs: number;
  completed: CompletedWorld | null;
  replays: RunRecord[];
}
