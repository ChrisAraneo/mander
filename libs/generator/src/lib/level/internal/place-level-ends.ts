import { placePlayerSpawn } from '../../structures/player-spawn/place-player-spawn';
import { placePortal } from '../../structures/portal/place-portal';
import type { clearLevelWeapons } from './clear-level-weapons';

export const placeLevelEnds = ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof clearLevelWeapons>) => ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles: placePortal(placePlayerSpawn(tiles, levelType), levelType),
  backTiles,
});
