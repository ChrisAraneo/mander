import type { Layers } from '@mander/model';
import { size } from 'lodash-es';
import { match } from 'ts-pattern';
import { generateChestItems } from '../../items/generate-chest-items';
import { isMirrored } from '../../structures/is-mirrored';
import { isVertical } from '../../structures/is-vertical';
import { createLevelMeta } from './create-level-meta';
import type { furnishLevel } from './furnish-level';
import { getHornedEnemyChance } from './get-horned-enemy-chance';
import { mirrorLayers } from './mirror-layers';

export const createGameLevel = ({
  seed,
  levelNumber,
  structures,
  tiles,
  backTiles,
}: ReturnType<typeof furnishLevel>) => {
  const layers = match(isMirrored(levelNumber))
    .with(true, () => mirrorLayers(tiles, backTiles))
    .otherwise((): Layers => ({ tiles, backTiles }));

  return {
    seed,
    width: size(layers.tiles[0]),
    height: size(layers.tiles),
    tiles: layers.tiles,
    backTiles: layers.backTiles,
    chestItems: generateChestItems(seed),
    hornedEnemyChance: getHornedEnemyChance(levelNumber),
    isOpenSided: isVertical(levelNumber),
    meta: createLevelMeta(structures),
  };
};
