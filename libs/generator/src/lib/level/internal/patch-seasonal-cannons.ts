import { match } from 'ts-pattern';
import { patchTripleCannons } from '../../cannons/patch-triple-cannons';
import type { LevelFurniture } from './types/level-furniture';

export const patchSeasonalCannons = ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles,
  backTiles,
  random,
}: LevelFurniture): LevelFurniture => ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles: match(season)
    .with('SUMMER', () => patchTripleCannons(tiles, random))
    .otherwise(() => tiles),
  backTiles,
  random,
});
