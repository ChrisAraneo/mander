import type { PlayedWorld } from '../types/played-world';
import type { RunRecord } from '../types/run-record';

export const toPlayedFromRun = (run: RunRecord): PlayedWorld => ({
  name: run.name,
  day: run.day,
  playedAt: run.playedAt,
  runs: 1,
});
