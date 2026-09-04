import { concat, reject, takeRight } from 'lodash-es';

import { RUNS_KEPT } from './consts';
import type { RunRecord, SaveData } from './save-data';

export const withRun = (save: SaveData, run: RunRecord): SaveData => ({
  ...save,
  runs: takeRight(concat(reject(save.runs, { id: run.id }), run), RUNS_KEPT),
});
