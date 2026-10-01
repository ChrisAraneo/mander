import { clearCannons } from '../../structures/cannons/clear-cannons';
import { clearFireballs } from '../../structures/fireballs/clear-fireballs';
import type { joinLevelStructures } from './join-level-structures';

export const clearLevelWeapons = ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof joinLevelStructures>) => ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles: clearFireballs(clearCannons(tiles, levelNumber), levelNumber),
  backTiles,
});
