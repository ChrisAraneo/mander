import type { PackedReplay } from '@mander/engine';

export type RunOutcome = 'COMPLETE' | 'GAME_OVER' | 'ABANDONED';

export interface RunRecord {
  id: string;
  name: string;
  day: string;
  playedAt: string;
  outcome: RunOutcome;
  score: number;
  seconds: number;
  levelIndex: number;
  replay: PackedReplay;
}

export interface CompletedWorld {
  name: string;
  day: string;
  score: number;
  seconds: number;
  runId: string;
  replay: PackedReplay | null;
}

export interface PlayedWorld {
  name: string;
  day: string;
  playedAt: string;
  runs: number;
}

export interface SaveData {
  score: number;
  completedWorlds: CompletedWorld[];
  playedWorlds: PlayedWorld[];
  runs: RunRecord[];
}
