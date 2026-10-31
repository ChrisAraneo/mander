import {
  GEM_ENTITY_BOX,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createPlayer } from '../../player/create-player';
import { isNearTile } from './is-near-tile';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel([
  '............',
  '............',
  's...........',
  '############',
]);

const TILE = { x: 2, y: 2 };

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  position: { x: left, y: top },
});

describe('isNearTile', () => {
  it('should say no when there is no tile', () => {
    const player = createPlayerAt(70, 60);

    const isNear = isNearTile(player, null, GEM_ENTITY_BOX, 4);

    expect(isNear).toBe(false);
  });

  it('should say yes when the player stands on the thing in the tile', () => {
    const player = createPlayerAt(70, 60);

    const isNear = isNearTile(player, TILE, GEM_ENTITY_BOX, 4);

    expect(isNear).toBe(true);
  });

  it('should say yes when the player is beside the thing in the tile and within the padding', () => {
    const player = createPlayerAt(92, 60);

    const isNear = isNearTile(player, TILE, GEM_ENTITY_BOX, 5);

    expect(isNear).toBe(true);
  });

  it('should say no when the player is beside the thing in the tile and just beyond the padding', () => {
    const player = createPlayerAt(92, 60);

    const isNear = isNearTile(player, TILE, GEM_ENTITY_BOX, 4);

    expect(isNear).toBe(false);
  });

  it('should say no when the player is far from the tile', () => {
    const player = createPlayerAt(300, 300);

    const isNear = isNearTile(player, TILE, GEM_ENTITY_BOX, 4);

    expect(isNear).toBe(false);
  });
});
