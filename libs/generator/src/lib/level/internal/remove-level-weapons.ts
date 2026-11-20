import { patchCannons } from '../../cannons/patch-cannons';
import { removeFireballs } from '../../fireballs/remove-fireballs';
import type { LevelDraft } from './types/level-draft';

export const removeLevelWeapons = ({
  levelNumber,
  levelVariant,
  levelType,
  season,
  structures,
  tiles,
  backTiles,
  random,
}: LevelDraft): LevelDraft => ({
  levelNumber,
  levelVariant,
  levelType,
  season,
  structures,
  tiles: removeFireballs(patchCannons(tiles, levelNumber), levelNumber),
  backTiles,
  random,
});
