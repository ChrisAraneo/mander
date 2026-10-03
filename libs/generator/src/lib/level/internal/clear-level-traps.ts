import { clearBeartraps } from '../../beartraps/clear-beartraps';
import { clearSpikes } from '../../spikes/clear-spikes';
import type { addLevelPadding } from './add-level-padding';

export const clearLevelTraps = ({
  random,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof addLevelPadding>) => ({
  random,
  levelNumber,
  levelType,
  structures,
  tiles: clearBeartraps(
    clearSpikes(tiles, levelNumber, random),
    levelNumber,
    random,
  ),
  backTiles,
});
