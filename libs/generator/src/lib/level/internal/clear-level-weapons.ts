import { clearCannons } from '../../cannons/clear-cannons';
import { clearFireballs } from '../../fireballs/clear-fireballs';
import type { joinLevelStructures } from './join-level-structures';

export const clearLevelWeapons = ({
  random,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof joinLevelStructures>) => ({
  random,
  levelNumber,
  levelType,
  structures,
  tiles: clearFireballs(clearCannons(tiles, levelNumber), levelNumber),
  backTiles,
});
