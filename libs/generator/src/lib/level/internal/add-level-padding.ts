import { addPadding } from '../../padding/add-padding';
import type { LevelDraft } from './types/level-draft';

export const addLevelPadding = ({
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
  tiles: addPadding(tiles),
  backTiles: addPadding(backTiles, tiles),
  random,
});
