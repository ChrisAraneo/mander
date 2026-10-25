import type { PackedReplay } from '@mander/engine';

export interface CompletedWorld {
  name: string;
  day: string;
  score: number;
  seconds: number;
  runId: string;
  replay: PackedReplay | null;
}
