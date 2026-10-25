import type { PackedReplay } from '@mander/engine';
import type { RunOutcome } from './run-outcome';

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
