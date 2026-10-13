import { addPlayerSpawn } from '../../player-spawn/add-player-spawn';
import { addPortal } from '../../portal/add-portal';
import type { removeLevelWeapons } from './remove-level-weapons';

export const addLevelEnds = ({
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: ReturnType<typeof removeLevelWeapons>) => ({
  levelNumber,
  levelType,
  structures,
  tiles: addPortal(addPlayerSpawn(tiles, levelType), levelType),
  backTiles,
  random,
});
