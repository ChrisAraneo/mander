import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';
import { head, includes, map, size } from 'lodash-es';
import { match } from 'ts-pattern';

const NOT_DRAWN = [STRUCTURE_START, STRUCTURE_END];

export const structureTileMap = (grid: number[][]): GameLevel => ({
  seed: '',
  width: size(head(grid)),
  height: size(grid),
  tiles: map(grid, (cells) =>
    map(cells, (cell): Tile =>
      match(includes(NOT_DRAWN, cell))
        .with(true, () => TILE_AIR)
        .otherwise(() => cell),
    ),
  ),
  chestItems: [],
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});
