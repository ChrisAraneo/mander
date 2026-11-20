import { addChest } from '../../chest/add-chest';
import { addGems } from '../../gems/add-gems';
import { addKey } from '../../key/add-key';
import { addStones } from '../../stones/add-stones';
import type { LevelFurniture } from './types/level-furniture';
import type { LevelDraft } from './types/level-draft';

export const addLevelFurniture = ({
  levelNumber,
  levelVariant,
  levelType,
  season,
  structures,
  tiles,
  backTiles,
  random,
}: LevelDraft): LevelFurniture => ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles: addStones(
    addGems(addChest(addKey(tiles, levelType), levelType), levelType, random),
    random,
  ),
  backTiles,
  random,
});
