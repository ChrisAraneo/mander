import {
  type Bullet,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BULLET_SPEED } from '../consts';
import { findStruckSpikeTile } from './find-struck-spike-tile';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
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

const LEVEL = createLevel(['.....', '.....', '.^...', '#####']);

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('findStruckSpikeTile', () => {
  it('should give the column and row of the spike when the bullet flies into its prongs', () => {
    const bullet = createBulletAt(40, 80);

    const tile = findStruckSpikeTile(LEVEL, bullet);

    expect(tile).toEqual({ x: 1, y: 2 });
  });

  it('should find no spike when the bullet passes through the spike tile above its prongs', () => {
    const bullet = createBulletAt(40, 63);

    const tile = findStruckSpikeTile(LEVEL, bullet);

    expect(tile).toBeUndefined();
  });

  it('should find no spike when there is no spike near the bullet', () => {
    const bullet = createBulletAt(120, 20);

    const tile = findStruckSpikeTile(LEVEL, bullet);

    expect(tile).toBeUndefined();
  });
});
