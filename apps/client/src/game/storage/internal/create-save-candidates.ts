import { concat, map, range } from 'lodash-es';
import { REPLAYS_KEPT, RUNS_KEPT } from '../consts';
import type { SaveData } from '../types/save-data';
import { cloneTrimmedSave } from './clone-trimmed-save';
import type { Rung } from './types/rung';

const RUNGS: readonly Rung[] = Object.freeze(
  concat(
    map(range(RUNS_KEPT, -1, -1), (runs): Rung => [runs, REPLAYS_KEPT]),
    map(range(REPLAYS_KEPT - 1, -1, -1), (worlds): Rung => [0, worlds]),
  ),
);

export const createSaveCandidates = (save: SaveData): SaveData[] =>
  map(RUNGS, (rung) => cloneTrimmedSave(save, rung));
