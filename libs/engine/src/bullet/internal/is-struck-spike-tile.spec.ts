import {
  PRONG_HEIGHT,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { isStruckSpikeTile } from './is-struck-spike-tile';

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

const LEVEL = createLevel(['.....', '.^...', '#####']);

const SPIKE_TILE = { x: 1, y: 1 };
const AIR_TILE = { x: 2, y: 1 };
const BOX_SIZE = 8;

const PRONG_TOP = (SPIKE_TILE.y + 1) * TILE_SIZE - PRONG_HEIGHT;

const createBoxAt = (left: number, top: number) => ({
  x: left,
  y: top,
  width: BOX_SIZE,
  height: BOX_SIZE,
});

describe('isStruckSpikeTile', () => {
  it('should say yes when the box lies over the prongs of a spike tile', () => {
    const box = createBoxAt(SPIKE_TILE.x * TILE_SIZE, PRONG_TOP);

    expect(isStruckSpikeTile(LEVEL, box, SPIKE_TILE)).toBe(true);
  });

  it('should say no when the box sits above the prongs of a spike tile', () => {
    const box = createBoxAt(SPIKE_TILE.x * TILE_SIZE, SPIKE_TILE.y * TILE_SIZE);

    expect(isStruckSpikeTile(LEVEL, box, SPIKE_TILE)).toBe(false);
  });

  it('should say no when the tile holds no spike', () => {
    const box = createBoxAt(AIR_TILE.x * TILE_SIZE, PRONG_TOP);

    expect(isStruckSpikeTile(LEVEL, box, AIR_TILE)).toBe(false);
  });

  it('should say no when the level holds no tiles at all', () => {
    const box = createBoxAt(SPIKE_TILE.x * TILE_SIZE, PRONG_TOP);

    expect(isStruckSpikeTile(createLevel([]), box, SPIKE_TILE)).toBe(false);
  });
});
