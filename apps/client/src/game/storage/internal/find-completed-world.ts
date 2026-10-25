import { find } from 'lodash-es';
import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';

export const findCompletedWorld = (
  save: SaveData,
  name: string,
): CompletedWorld | null => find(save.completedWorlds, { name }) ?? null;
