import { removeCannons } from '../../cannons/remove-cannons';
import { removeFireballs } from '../../fireballs/remove-fireballs';
import type { LevelDraft } from './types/level-draft';

export const removeLevelWeapons = ({
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: LevelDraft): LevelDraft => ({
  levelNumber,
  levelType,
  structures,
  tiles: removeFireballs(removeCannons(tiles, levelNumber), levelNumber),
  backTiles,
  random,
});
