import { clearBeartraps } from '../../structures/beartraps/clear-beartraps';
import { clearSpikes } from '../../structures/spikes/clear-spikes';
import type { addLevelPadding } from './add-level-padding';

export const clearLevelTraps = ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof addLevelPadding>) => ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles: clearBeartraps(clearSpikes(tiles, levelNumber), levelNumber),
  backTiles,
});
