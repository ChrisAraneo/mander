import type { GameLevel } from '@mander/engine';
import { type Layers } from '@mander/model';
import { size } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { takeRandomChestItems } from '../../items/take-random-chest-items';
import { isMirrored } from '../../structures/is-mirrored';
import { isVertical } from '../../structures/is-vertical';
import { createLevelMeta } from './create-level-meta';
import { getFastEnemyChance } from './get-fast-enemy-chance';
import { getHornedEnemyChance } from './get-horned-enemy-chance';
import { getShooterEnemyChance } from './get-shooter-enemy-chance';
import { hashLevelSeed } from './hash-level-seed';
import { toMirroredLayers } from './to-mirrored-layers';
import type { FurnishedLevel } from './types/furnished-level';

export const createGameLevel = ({
  levelNumber,
  levelVariant,
  structures,
  tiles,
  backTiles,
  random,
}: FurnishedLevel): GameLevel =>
  pipe(
    levelVariant,
    isMirrored,
    (isMirroredLevel) =>
      match(isMirroredLevel)
        .with(true, () => toMirroredLayers(tiles, backTiles))
        .otherwise((): Layers => ({ tiles, backTiles })),
    (layers): GameLevel => ({
      seed: hashLevelSeed(random),
      width: size(layers.tiles[0]),
      height: size(layers.tiles),
      tiles: layers.tiles,
      backTiles: layers.backTiles,
      chestItems: takeRandomChestItems(random),
      hornedEnemyChance: getHornedEnemyChance(levelNumber),
      fastEnemyChance: getFastEnemyChance(levelNumber),
      shooterEnemyChance: getShooterEnemyChance(levelNumber),
      isOpenSided: isVertical(levelVariant),
      meta: createLevelMeta(structures),
    }),
  );
