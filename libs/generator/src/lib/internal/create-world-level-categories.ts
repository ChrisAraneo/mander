import { LEVELS_PER_DAY } from '../consts';
import { createLevelCategories } from '../world/create-level-categories';
import type { WorldLevelCategories } from './types/world-level-categories';
import type { WorldPalette } from './types/world-palette';

export const createWorldLevelCategories = ({
  name,
  palette,
  random,
}: WorldPalette): WorldLevelCategories => ({
  name,
  palette,
  levelCategories: createLevelCategories(LEVELS_PER_DAY),
  random,
});
