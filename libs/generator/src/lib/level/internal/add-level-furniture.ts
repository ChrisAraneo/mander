import { addChest } from '../../chest/add-chest';
import { addGems } from '../../gems/add-gems';
import { addKey } from '../../key/add-key';
import { addStones } from '../../stones/add-stones';
import type { FurnishedLevel } from './types/furnished-level';
import type { LevelDraft } from './types/level-draft';

export const addLevelFurniture = ({
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: LevelDraft): FurnishedLevel => ({
  levelNumber,
  structures,
  tiles: addStones(
    addGems(addChest(addKey(tiles, levelType), levelType), levelType, random),
    random,
  ),
  backTiles,
  random,
});
