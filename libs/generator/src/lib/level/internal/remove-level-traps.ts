import { removeBeartraps } from '../../beartraps/remove-beartraps';
import { removeSpikes } from '../../spikes/remove-spikes';
import type { LevelDraft } from './types/level-draft';

export const removeLevelTraps = ({
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
  tiles: removeBeartraps(
    removeSpikes(tiles, levelNumber, random),
    levelNumber,
    random,
  ),
  backTiles,
  random,
});
