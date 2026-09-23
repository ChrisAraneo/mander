import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { every, last, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addPadding, getPadding, padTiles } from './add-padding';

const SKY_HEIGHT = 20;

const row = (tile: number): number[] => times(4, () => tile);

const ground = (): number[][] => [row(TILE_AIR), row(TILE_DIRT)];

describe('getPadding', () => {
  it('should reach for enough bedrock to bury the lowest filled row when the level is shallow', () => {
    expect(getPadding(ground())).toEqual({ sky: SKY_HEIGHT, depth: 4 });
  });

  it('should ask for no bedrock when the level is already deep enough', () => {
    expect(
      getPadding([
        row(TILE_DIRT),
        row(TILE_AIR),
        ...times(4, () => row(TILE_AIR)),
      ]).depth,
    ).toBe(0);
  });
});

describe('padTiles', () => {
  it('should hang the sky above and the bedrock below when it pads a grid', () => {
    const padded = padTiles(ground(), getPadding(ground()));

    expect(size(padded)).toBe(SKY_HEIGHT + 2 + 4);
    expect(
      every(padded.slice(0, SKY_HEIGHT), (cells) =>
        every(cells, (tile) => tile === TILE_AIR),
      ),
    ).toBe(true);
    expect(last(padded)).toEqual(row(TILE_DIRT));
  });

  it('should measure the padding off the first layer when it pads a second, so the two stay the same shape', () => {
    const front = ground();
    const back = [row(TILE_DIRT), row(TILE_AIR)];
    const padding = getPadding(front);

    expect(map(padTiles(back, padding), size)).toEqual(
      map(padTiles(front, padding), size),
    );
    expect(size(padTiles(back, padding))).toBe(size(padTiles(front, padding)));
  });

  it('should leave the grid empty when there is nothing on it', () => {
    expect(padTiles([], getPadding([]))).toEqual([]);
  });
});

describe('addPadding', () => {
  it('should pad the grid by its own measure when it is given one', () => {
    expect(addPadding(ground())).toEqual(
      padTiles(ground(), getPadding(ground())),
    );
  });
});
