import { addPadding } from '../../structures/padding/add-padding';
import type { placeLevelEnds } from './place-level-ends';

export const addLevelPadding = ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof placeLevelEnds>) => ({
  seed,
  levelNumber,
  levelType,
  structures,
  tiles: addPadding(tiles),
  backTiles: addPadding(backTiles, tiles),
});
