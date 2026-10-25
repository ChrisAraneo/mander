import type { FinishedRun } from '../types/finished-run';
import type { RunRecord } from '../types/run-record';
import { createRunId } from './create-run-id';

export const createRunRecord = (
  run: FinishedRun,
  playedAt: string,
  random: () => number,
): RunRecord => ({
  ...run,
  id: createRunId(run.name, playedAt, random),
  playedAt,
});
