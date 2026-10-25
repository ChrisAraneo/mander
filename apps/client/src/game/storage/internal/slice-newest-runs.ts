import { takeRight } from 'lodash-es';
import type { SaveData } from '../types/save-data';

export const sliceNewestRuns = (save: SaveData, count: number): SaveData => ({
  ...save,
  runs: takeRight(save.runs, count),
});
