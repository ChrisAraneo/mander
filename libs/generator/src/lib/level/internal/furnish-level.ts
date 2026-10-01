import { placeChest } from '../../structures/chest/place-chest';
import { placeGems } from '../../structures/gems/place-gems';
import { placeKey } from '../../structures/key/place-key';
import { placeStones } from '../../structures/stones/place-stones';
import type { clearLevelTraps } from './clear-level-traps';

export const furnishLevel = ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof clearLevelTraps>) => ({
  seed,
  levelNumber,
  structures,
  tiles: placeStones(
    placeGems(placeChest(placeKey(tiles, levelType), levelType), levelType),
  ),
  backTiles,
});
