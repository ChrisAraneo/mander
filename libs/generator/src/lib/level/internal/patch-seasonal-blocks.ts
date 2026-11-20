import { identity } from 'lodash-es';
import { match } from 'ts-pattern';
import { patchBloomedBlocks } from '../../bloom/patch-bloomed-blocks';
import { patchFrozenBlocks } from '../../ice/patch-frozen-blocks';
import { createSandPatch } from '../../sand/create-sand-patch';
import type { LayerPatch } from '../../types/layer-patch';
import type { LevelFurniture } from './types/level-furniture';

const getSeasonalPatch = ({
  season,
  tiles,
  random,
}: LevelFurniture): LayerPatch =>
  match(season)
    .with('WINTER', () => patchFrozenBlocks)
    .with('SPRING', () => patchBloomedBlocks)
    .with('SUMMER', () => createSandPatch(tiles, random))
    .otherwise((): LayerPatch => identity);

const patchSeasonalLayers = (
  {
    levelNumber,
    levelVariant,
    season,
    structures,
    tiles,
    backTiles,
    random,
  }: LevelFurniture,
  patch: LayerPatch,
): LevelFurniture => ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles: patch(tiles),
  backTiles: patch(backTiles),
  random,
});

export const patchSeasonalBlocks = (level: LevelFurniture): LevelFurniture =>
  patchSeasonalLayers(level, getSeasonalPatch(level));
