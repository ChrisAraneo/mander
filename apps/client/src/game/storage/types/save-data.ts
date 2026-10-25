import type { CompletedWorld } from './completed-world';
import type { PlayedWorld } from './played-world';
import type { RunRecord } from './run-record';

export interface SaveData {
  score: number;
  completedWorlds: CompletedWorld[];
  playedWorlds: PlayedWorld[];
  runs: RunRecord[];
}
