import { addPadding } from '../../padding/add-padding';
import type { LevelDraft } from './types/level-draft';

export const addLevelPadding = ({
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
  tiles: addPadding(tiles),
  backTiles: addPadding(backTiles, tiles),
  random,
});
