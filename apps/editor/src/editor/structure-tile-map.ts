import { type GameLevel, HORNED_ENEMY_CHANCE } from '@mander/engine';
import { type Layers, type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';
import { head, includes, map, size } from 'lodash-es';
import { match } from 'ts-pattern';

const NOT_DRAWN = [STRUCTURE_START, STRUCTURE_END];

const drawn = (cell: number): Tile =>
  match(includes(NOT_DRAWN, cell))
    .with(true, () => TILE_AIR)
    .otherwise(() => cell);

const painted = (grid: number[][]): Tile[][] =>
  map(grid, (cells) => map(cells, drawn));

// the two layers the editor paints are the two layers the game draws
export const structureTileMap = ({ tiles, backTiles }: Layers): GameLevel => ({
  seed: '',
  width: size(head(tiles)),
  height: size(tiles),
  tiles: painted(tiles),
  backTiles: painted(backTiles),
  chestItems: [],
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});
