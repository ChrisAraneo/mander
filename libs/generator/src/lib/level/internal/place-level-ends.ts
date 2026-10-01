import { placePlayerSpawn } from '../../structures/player-spawn/place-player-spawn';
import { placePortal } from '../../structures/portal/place-portal';
import type { clearLevelWeapons } from './clear-level-weapons';

export const placeLevelEnds = ({
  random,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof clearLevelWeapons>) => ({
  random,
  levelNumber,
  levelType,
  structures,
  tiles: placePortal(placePlayerSpawn(tiles, levelType), levelType),
  backTiles,
});
