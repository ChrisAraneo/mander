import { floor, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { TILE_SIZE } from '@mander/generator';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../state';

export const probeColumn = (originX: number, facing: 1 | -1): number =>
  floor(
    match(facing > 0)
      .with(true, () => originX + ENEMY_WIDTH + 1)
      .otherwise(() => originX - 1) / TILE_SIZE
  );

export const probeRows = (originY: number): number[] =>
  range(floor((originY + 2) / TILE_SIZE), floor((originY + ENEMY_HEIGHT - 2) / TILE_SIZE) + 1);

export const belowRow = (originY: number): number => floor((originY + ENEMY_HEIGHT + 2) / TILE_SIZE);
