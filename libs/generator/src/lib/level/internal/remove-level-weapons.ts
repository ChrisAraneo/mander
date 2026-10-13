import { removeCannons } from '../../cannons/remove-cannons';
import { removeFireballs } from '../../fireballs/remove-fireballs';
import type { createLevelLayers } from './create-level-layers';

export const removeLevelWeapons = ({
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: ReturnType<typeof createLevelLayers>) => ({
  levelNumber,
  levelType,
  structures,
  tiles: removeFireballs(removeCannons(tiles, levelNumber), levelNumber),
  backTiles,
  random,
});
