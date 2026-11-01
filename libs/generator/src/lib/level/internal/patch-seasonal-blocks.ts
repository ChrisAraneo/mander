import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { bloomBlocks } from '../../bloom/bloom-blocks';
import { freezeBlocks } from '../../ice/freeze-blocks';
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
