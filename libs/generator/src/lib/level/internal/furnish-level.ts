import { placeChest } from '../../chest/place-chest';
import { placeGems } from '../../gems/place-gems';
import { placeKey } from '../../key/place-key';
import { placeStones } from '../../stones/place-stones';
import type { clearLevelTraps } from './clear-level-traps';

export const furnishLevel = ({
  random,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof clearLevelTraps>) => ({
  random,
  levelNumber,
  structures,
  tiles: placeStones(
    placeGems(
      placeChest(placeKey(tiles, levelType), levelType),
      levelType,
      random,
    ),
    random,
  ),
  backTiles,
});
