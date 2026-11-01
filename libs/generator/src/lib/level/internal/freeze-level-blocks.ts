import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { freezeBlocks } from '../../ice/freeze-blocks';
import type { FurnishedLevel } from './types/furnished-level';

const keepBlocks = (tiles: Tile[][]): Tile[][] => tiles;

export const freezeLevelBlocks = ({
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
      .otherwise(() => keepBlocks),
    (freeze): FurnishedLevel => ({
      levelNumber,
      levelVariant,
      season,
      structures,
      tiles: freeze(tiles),
      backTiles: freeze(backTiles),
      random,
    }),
  );
