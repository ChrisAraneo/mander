import { createLevelVariants } from '../world/create-level-variants';
import type { WorldLevelVariants } from './types/world-level-variants';
import type { WorldPalette } from './types/world-palette';

export const createWorldLevelVariants = ({
  name,
  palette,
  random,
}: WorldPalette): WorldLevelVariants => ({
  name,
  palette,
  levelVariants: createLevelVariants(random),
  random,
});
