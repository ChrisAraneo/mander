import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { bloomBlocks } from '../../bloom/bloom-blocks';
import { freezeBlocks } from '../../ice/freeze-blocks';
import { createSandPatch } from '../../sand/create-sand-patch';
import type { FurnishedLevel } from './types/furnished-level';

const keepBlocks = (tiles: Tile[][]): Tile[][] => tiles;

export const patchSeasonalBlocks = ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles,
  backTiles,
  random,
}: FurnishedLevel): FurnishedLevel =>
  pipe(
    match(season)
      .with('WINTER', () => freezeBlocks)
      .with('SPRING', () => bloomBlocks)
      .with('SUMMER', () => createSandPatch(tiles, random))
      .otherwise(() => keepBlocks),
    (patch): FurnishedLevel => ({
      levelNumber,
      levelVariant,
      season,
      structures,
      tiles: patch(tiles),
      backTiles: patch(backTiles),
      random,
    }),
  );
