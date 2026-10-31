import type { GameLevel } from '@mander/engine';
import {
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_BRICK,
  TILE_CANNON,
  TILE_CERAMIC,
  TILE_CHEST,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_GEM,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { pipe } from 'remeda';

const LEGEND: Readonly<Record<string, Tile>> = Object.freeze({
  '.': TILE_AIR,
  '#': TILE_DIRT,
  B: TILE_BRICK,
  S: TILE_STONE,
  W: TILE_WOOD,
  R: TILE_CERAMIC,
  F: TILE_FIREBALL,
  N: TILE_CANNON,
  '^': TILE_SPIKE,
  v: TILE_SPIKE_CEILING,
  '!': TILE_SPIKE_FALLING,
  K: TILE_KEY,
  C: TILE_CHEST,
  P: TILE_PORTAL,
  G: TILE_GEM,
  E: TILE_ENEMY,
  T: TILE_BEARTRAP,
  '@': TILE_SPAWN,
});

export const createRenderTestLevel = (
  rows: string[],
  backRows: string[] = [],
): GameLevel =>
  pipe(
    [rows, backRows],
    (layers) =>
      map(layers, (layer) =>
        map(layer, (row) =>
          map([...row], (symbol) => LEGEND[symbol] ?? TILE_AIR),
        ),
      ),
    ([tiles, backTiles]): GameLevel => ({
      seed: 'RENDER',
      width: size(head(tiles)),
      height: size(tiles),
      tiles,
      backTiles,
      chestItems: [],
      hornedEnemyChance: 0,
      fastEnemyChance: 0,
      shooterEnemyChance: 0,
      freezingEnemyChance: 0,
    }),
  );
