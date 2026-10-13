import type { Layers } from '@mander/model';
import { chain } from '@mander/utils';
import { size } from 'lodash-es';
import { match } from 'ts-pattern';
import { takeRandomChestItems } from '../../items/take-random-chest-items';
import { isMirrored } from '../../structures/is-mirrored';
import { isVertical } from '../../structures/is-vertical';
import type { addLevelFurniture } from './add-level-furniture';
import { createLevelMeta } from './create-level-meta';
import { getHornedEnemyChance } from './get-horned-enemy-chance';
import { hashLevelSeed } from './hash-level-seed';
import { toMirroredLayers } from './to-mirrored-layers';

export const createGameLevel = ({
  levelNumber,
  structures,
  tiles,
  backTiles,
  random,
}: ReturnType<typeof addLevelFurniture>) =>
  chain(
    match(isMirrored(levelNumber))
      .with(true, () => toMirroredLayers(tiles, backTiles))
      .otherwise((): Layers => ({ tiles, backTiles })),
  )
    .thru((layers) => ({
      seed: hashLevelSeed(random),
      width: size(layers.tiles[0]),
      height: size(layers.tiles),
      tiles: layers.tiles,
      backTiles: layers.backTiles,
      chestItems: takeRandomChestItems(random),
      hornedEnemyChance: getHornedEnemyChance(levelNumber),
      isOpenSided: isVertical(levelNumber),
      meta: createLevelMeta(structures),
    }))
    .value();
