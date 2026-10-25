import type { PackedReplay } from '@mander/engine';
import type { RunOutcome } from './run-outcome';

export interface FinishedRun {
  name: string;
  day: string;
  outcome: RunOutcome;
  score: number;
  seconds: number;
  levelIndex: number;
  replay: PackedReplay;
}
