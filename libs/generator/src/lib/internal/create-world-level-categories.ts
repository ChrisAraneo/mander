import { LEVELS_PER_DAY } from '../consts';
import { createLevelCategories } from '../world/create-level-categories';
import type { createWorldPalette } from './create-world-palette';

export const createWorldLevelCategories = ({
  name,
  palette,
  random,
}: ReturnType<typeof createWorldPalette>) => ({
  name,
  palette,
  levelCategories: createLevelCategories(LEVELS_PER_DAY),
  random,
});
