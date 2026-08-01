import {
  type Level,
  type Palette,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE,
} from '@mander/engine';
import { filter, map, some } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { STROKE_WIDTH } from './stroke';
import { strokeTileEdges } from './stroke-tile-edges';

const EMPTY_PALETTE: Palette = {
  sky: ['', '', ''],
  hills: ['', ''],
  block: '',
  blockCap: '',
  blockCapHighlight: '',
};

/** `#` is a block, `^` a spike, anything else air. */
const tileMap = (rows: string[]): Level => {
  const tiles: Tile[][] = map(rows, (row) =>
    map(row.split(''), (cell): Tile =>
      match(cell)
        .with('#', () => TILE_DIRT)
        .with('^', () => TILE_SPIKE)
        .otherwise(() => TILE_AIR),
    ),
  );

  return {
    seed: 'TEST',
    width: tiles[0].length,
    height: tiles.length,
    tiles,
    palette: EMPTY_PALETTE,
    chestItems: [],
    enemies: [],
  };
};

interface Bar {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The bars a tile paints, caught off a context that only records them. */
const barsFor = (level: Level, column: number, row: number): Bar[] => {
  const bars: Bar[] = [];
  const context = {
    fillStyle: '',
    fillRect: (x: number, y: number, width: number, height: number): void => {
      bars.push({ x, y, width, height });
    },
  } as unknown as CanvasRenderingContext2D;

  strokeTileEdges(context, level, column, row);
  return bars;
};

const isTop = (bar: Bar, row: number): boolean =>
  bar.y === row * TILE_SIZE && bar.height === STROKE_WIDTH;

const isBottom = (bar: Bar, row: number): boolean =>
  bar.y === (row + 1) * TILE_SIZE - STROKE_WIDTH && bar.height === STROKE_WIDTH;

const isLeft = (bar: Bar, column: number): boolean =>
  bar.x === column * TILE_SIZE && bar.width === STROKE_WIDTH;

const isRight = (bar: Bar, column: number): boolean =>
  bar.x === (column + 1) * TILE_SIZE - STROKE_WIDTH &&
  bar.width === STROKE_WIDTH;

describe('strokeTileEdges', () => {
  it('outlines a lone block on all four sides', () => {
    const bars = barsFor(tileMap(['...', '.#.', '...']), 1, 1);

    expect(bars).toHaveLength(4);
    expect(some(bars, (bar) => isTop(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isBottom(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isLeft(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isRight(bar, 1))).toBe(true);
  });

  it('leaves the edges a block shares with its neighbours bare', () => {
    expect(barsFor(tileMap(['.#.', '###', '.#.']), 1, 1)).toHaveLength(0);
  });

  it('draws only the sides of a wall that face open air', () => {
    const bars = barsFor(tileMap(['...', '###', '...']), 1, 1);

    expect(bars).toHaveLength(2);
    expect(some(bars, (bar) => isTop(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isBottom(bar, 1))).toBe(true);
  });

  it('keeps every bar inside the tile it belongs to', () => {
    const bars = barsFor(tileMap(['...', '.#.', '...']), 1, 1);

    expect(
      filter(
        bars,
        (bar) =>
          bar.x >= TILE_SIZE &&
          bar.y >= TILE_SIZE &&
          bar.x + bar.width <= 2 * TILE_SIZE &&
          bar.y + bar.height <= 2 * TILE_SIZE,
      ),
    ).toHaveLength(4);
  });

  it('outlines the edge a block shares with a spike', () => {
    const bars = barsFor(tileMap(['.^.', '###', '###']), 1, 1);

    expect(some(bars, (bar) => isTop(bar, 1))).toBe(true);
  });

  it('outlines the edges that face off the level', () => {
    const bars = barsFor(tileMap(['##', '##']), 0, 0);

    expect(bars).toHaveLength(2);
    expect(some(bars, (bar) => isTop(bar, 0))).toBe(true);
    expect(some(bars, (bar) => isLeft(bar, 0))).toBe(true);
  });
});
