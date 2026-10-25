import { concat, reject, takeRight } from 'lodash-es';
import { RUNS_KEPT } from '../consts';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';

export const addRun = (save: SaveData, run: RunRecord): SaveData => ({
  ...save,
  runs: takeRight(concat(reject(save.runs, { id: run.id }), run), RUNS_KEPT),
});
