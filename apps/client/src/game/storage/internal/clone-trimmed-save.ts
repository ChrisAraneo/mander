import { pipe } from 'remeda';
import type { SaveData } from '../types/save-data';
import { removeOldReplays } from './remove-old-replays';
import { sliceNewestRuns } from './slice-newest-runs';
import type { Rung } from './types/rung';

export const cloneTrimmedSave = (
  save: SaveData,
  [runs, worlds]: Rung,
): SaveData =>
  pipe(
    save,
    (full) => sliceNewestRuns(full, runs),
    (sliced) => removeOldReplays(sliced, worlds),
  );
