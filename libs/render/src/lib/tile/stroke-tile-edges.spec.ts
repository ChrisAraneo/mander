import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE,
} from '@mander/engine';
import { chain, filter, map, some } from 'lodash-es';
import { tap } from 'ramda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { STROKE_WIDTH } from '../stroke/stroke';
import { strokeTileEdges } from './stroke-tile-edges';

const toTile = (cell: string): Tile =>
  match(cell)
    .with('#', () => TILE_DIRT)
    .with('^', () => TILE_SPIKE)
    .otherwise(() => TILE_AIR);

const tileMap = (rows: string[]): Level =>
  chain(rows)
    .thru((lines) => map(lines, (row) => map(row.split(''), toTile)))
    .thru((tiles) => ({
      seed: 'TEST',
      width: tiles[0].length,
      height: tiles.length,
      tiles,
      chestItems: [],
    }))
    .value();

interface Bar {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Recorder {
  bars: Bar[];
  context: CanvasRenderingContext2D;
}

const recorder = (): Recorder =>
  chain([] as Bar[])
    .thru((bars) => ({
      bars,
      context: {
        fillStyle: '',
        fillRect: (x: number, y: number, width: number, height: number) =>
          bars.push({ x, y, width, height }),
      } as unknown as CanvasRenderingContext2D,
    }))
    .value();

const barsFor = (level: Level, column: number, row: number): Bar[] =>
  chain(recorder())
    .thru(
      tap(({ context }: Recorder) =>
        strokeTileEdges(context, level, column, row),
      ),
    )
    .thru(({ bars }) => bars)
    .value();

const isTop = (bar: Bar, row: number): boolean =>
  bar.y === row * TILE_SIZE && bar.height === STROKE_WIDTH;

const isBottom = (bar: Bar, row: number): boolean =>
  bar.y === (row + 1) * TILE_SIZE - STROKE_WIDTH && bar.height === STROKE_WIDTH;

const isLeft = (bar: Bar, column: number): boolean =>
  bar.x === column * TILE_SIZE && bar.width === STROKE_WIDTH;

const isRight = (bar: Bar, column: number): boolean =>
  bar.x === (column + 1) * TILE_SIZE - STROKE_WIDTH &&
  bar.width === STROKE_WIDTH;

const isCornerSquare = (bar: Bar): boolean =>
  bar.width === STROKE_WIDTH && bar.height === STROKE_WIDTH;

const isTopLeftSquare = (bar: Bar, column: number, row: number): boolean =>
  isCornerSquare(bar) &&
  bar.x === column * TILE_SIZE &&
  bar.y === row * TILE_SIZE;

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
    const bars = barsFor(tileMap(['.#.', '###', '.#.']), 1, 1);

    expect(filter(bars, (bar) => !isCornerSquare(bar))).toHaveLength(0);
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

  it('fills the notch an inside corner leaves', () => {
    const bars = barsFor(tileMap(['.#', '##']), 1, 1);

    expect(bars).toHaveLength(3);
    expect(some(bars, (bar) => isTopLeftSquare(bar, 1, 1))).toBe(true);
  });

  it('leaves a corner alone when its own sides already face air', () => {
    const bars = barsFor(tileMap(['..', '.#']), 1, 1);

    expect(bars).toHaveLength(4);
    expect(some(bars, isCornerSquare)).toBe(false);
  });

  it('leaves a corner alone when the diagonal is filled in', () => {
    expect(some(barsFor(tileMap(['##', '##']), 1, 1), isCornerSquare)).toBe(
      false,
    );
  });

  it('fills all four notches when a block is nipped at every diagonal', () => {
    const bars = barsFor(tileMap(['.#.', '###', '.#.']), 1, 1);

    expect(bars).toHaveLength(4);
    expect(filter(bars, isCornerSquare)).toHaveLength(4);
  });
});
