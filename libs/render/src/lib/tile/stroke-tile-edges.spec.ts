import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE,
} from '@mander/model';
import { chain, tapEffect } from '@mander/utils';
import { filter, map, size, some, split } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { STROKE_WIDTH } from '../stroke/consts';
import { strokeTileEdges } from './stroke-tile-edges';

const toTile = (cell: string): Tile =>
  match(cell)
    .with('#', () => TILE_DIRT)
    .with('^', () => TILE_SPIKE)
    .otherwise(() => TILE_AIR);

const createEdgeLevel = (rows: string[]): Level =>
  chain(rows)
    .thru((lines) => map(lines, (row) => map(split(row, ''), toTile)))
    .thru((tiles) => ({
      seed: 'TEST',
      width: size(tiles[0]),
      height: size(tiles),
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

const drawEdgeBars = (level: Level, column: number, row: number): Bar[] =>
  chain(createRecordingContext())
    .thru((recording) =>
      tapEffect(recording, ({ context }) =>
        strokeTileEdges(context, level, column, row),
      ),
    )
    .thru(({ calls }) =>
      map(
        filter(calls, (call) => call.name === 'fillRect'),
        (call): Bar => ({
          x: Number(call.args[0]),
          y: Number(call.args[1]),
          width: Number(call.args[2]),
          height: Number(call.args[3]),
        }),
      ),
    )
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
  it('should outline all four sides when the block stands alone', () => {
    const bars = drawEdgeBars(createEdgeLevel(['...', '.#.', '...']), 1, 1);

    expect(bars).toHaveLength(4);
    expect(some(bars, (bar) => isTop(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isBottom(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isLeft(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isRight(bar, 1))).toBe(true);
  });

  it('should leave the edge bare when the block shares it with a neighbour', () => {
    const bars = drawEdgeBars(createEdgeLevel(['.#.', '###', '.#.']), 1, 1);

    expect(filter(bars, (bar) => !isCornerSquare(bar))).toHaveLength(0);
  });

  it('should draw only the sides that face open air when the block sits in a wall', () => {
    const bars = drawEdgeBars(createEdgeLevel(['...', '###', '...']), 1, 1);

    expect(bars).toHaveLength(2);
    expect(some(bars, (bar) => isTop(bar, 1))).toBe(true);
    expect(some(bars, (bar) => isBottom(bar, 1))).toBe(true);
  });

  it('should keep every bar inside the tile it belongs to when it outlines one', () => {
    const bars = drawEdgeBars(createEdgeLevel(['...', '.#.', '...']), 1, 1);

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

  it('should outline the edge when the block shares it with a spike', () => {
    const bars = drawEdgeBars(createEdgeLevel(['.^.', '###', '###']), 1, 1);

    expect(some(bars, (bar) => isTop(bar, 1))).toBe(true);
  });

  it('should outline the edges when they face off the level', () => {
    const bars = drawEdgeBars(createEdgeLevel(['##', '##']), 0, 0);

    expect(bars).toHaveLength(2);
    expect(some(bars, (bar) => isTop(bar, 0))).toBe(true);
    expect(some(bars, (bar) => isLeft(bar, 0))).toBe(true);
  });

  it('should fill the notch when an inside corner leaves one', () => {
    const bars = drawEdgeBars(createEdgeLevel(['.#', '##']), 1, 1);

    expect(bars).toHaveLength(3);
    expect(some(bars, (bar) => isTopLeftSquare(bar, 1, 1))).toBe(true);
  });

  it('should leave the corner alone when its own sides already face air', () => {
    const bars = drawEdgeBars(createEdgeLevel(['..', '.#']), 1, 1);

    expect(bars).toHaveLength(4);
    expect(some(bars, isCornerSquare)).toBe(false);
  });

  it('should leave the corner alone when the diagonal is filled in', () => {
    expect(
      some(drawEdgeBars(createEdgeLevel(['##', '##']), 1, 1), isCornerSquare),
    ).toBe(false);
  });

  it('should fill all four notches when the block is nipped at every diagonal', () => {
    const bars = drawEdgeBars(createEdgeLevel(['.#.', '###', '.#.']), 1, 1);

    expect(bars).toHaveLength(4);
    expect(filter(bars, isCornerSquare)).toHaveLength(4);
  });
});
