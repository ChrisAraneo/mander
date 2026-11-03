import { match } from 'ts-pattern';
import { patchTripleCannons } from '../../cannons/patch-triple-cannons';
import type { FurnishedLevel } from './types/furnished-level';

export const patchSeasonalCannons = ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles,
  backTiles,
  random,
}: FurnishedLevel): FurnishedLevel => ({
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
