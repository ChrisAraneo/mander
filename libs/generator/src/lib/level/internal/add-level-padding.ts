import { addPadding } from '../../padding/add-padding';
import type { addLevelEnds } from './add-level-ends';

export const addLevelPadding = ({
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
  random,
}: ReturnType<typeof addLevelEnds>) => ({
  levelNumber,
  levelType,
  structures,
  tiles: addPadding(tiles),
  backTiles: addPadding(backTiles, tiles),
  random,
});
