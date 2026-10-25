import { concat, find, reject } from 'lodash-es';
import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';
import { findBestCompletedWorld } from './find-best-completed-world';

export const addCompletedWorld = (
  save: SaveData,
  run: CompletedWorld,
): SaveData => ({
  ...save,
  score: run.score,
  completedWorlds: concat(
    reject(save.completedWorlds, { name: run.name }),
    findBestCompletedWorld(run, find(save.completedWorlds, { name: run.name })),
  ),
});
