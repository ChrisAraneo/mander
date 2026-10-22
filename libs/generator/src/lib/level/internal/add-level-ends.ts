import { addPlayerSpawn } from '../../player-spawn/add-player-spawn';
import { addPortal } from '../../portal/add-portal';
import type { LevelDraft } from './types/level-draft';

export const addLevelEnds = ({
  levelNumber,
  levelVariant,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: LevelDraft): LevelDraft => ({
  levelNumber,
  levelVariant,
  levelType,
  structures,
  tiles: addPortal(addPlayerSpawn(tiles, levelType), levelType),
  backTiles,
  random,
});
