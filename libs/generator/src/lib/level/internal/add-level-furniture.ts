import { addChest } from '../../chest/add-chest';
import { addGems } from '../../gems/add-gems';
import { addKey } from '../../key/add-key';
import { addStones } from '../../stones/add-stones';
import type { removeLevelTraps } from './remove-level-traps';

export const addLevelFurniture = ({
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: ReturnType<typeof removeLevelTraps>) => ({
  levelNumber,
  structures,
  tiles: addStones(
    addGems(addChest(addKey(tiles, levelType), levelType), levelType, random),
    random,
  ),
  backTiles,
  random,
});
