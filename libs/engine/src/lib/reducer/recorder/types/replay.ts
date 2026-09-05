import type { RecordedAction } from './recorded-action';

/**
 * A run is its inputs plus how many fixed steps it lasted. Ticks are not stored:
 * every step is `FIXED_STEP_SECONDS`, so the step index an input was seen on is
 * enough to replay the run exactly.
 */
export interface Replay {
  worldName: string;
  steps: number;
  entries: RecordedAction[];
}
