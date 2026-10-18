import { removeBeartraps } from '../../beartraps/remove-beartraps';
import { removeSpikes } from '../../spikes/remove-spikes';
import type { LevelDraft } from './types/level-draft';

export const removeLevelTraps = ({
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
  tiles: removeBeartraps(
    removeSpikes(tiles, levelNumber, random),
    levelNumber,
    random,
  ),
  backTiles,
  random,
});
