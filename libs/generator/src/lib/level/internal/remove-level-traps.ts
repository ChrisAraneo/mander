import { removeBeartraps } from '../../beartraps/remove-beartraps';
import { removeSpikes } from '../../spikes/remove-spikes';
import type { addLevelPadding } from './add-level-padding';

export const removeLevelTraps = ({
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: ReturnType<typeof addLevelPadding>) => ({
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
