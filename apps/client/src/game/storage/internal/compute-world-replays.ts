import { concat, filter, orderBy } from 'lodash-es';
import { pipe } from 'remeda';
import type { CompletedWorld } from '../types/completed-world';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { createMissingBestRuns } from './create-missing-best-runs';
import { isPlayable } from './is-playable';

export const computeWorldReplays = (
  save: SaveData,
  name: string,
  completed: CompletedWorld | null,
): RunRecord[] =>
  pipe(
    filter(save.runs, { name }),
    (runs) =>
      concat(
        orderBy(runs, ['playedAt'], ['desc']),
        createMissingBestRuns(completed, runs),
      ),
    (runs) => filter(runs, isPlayable),
  );
