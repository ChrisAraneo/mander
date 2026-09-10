import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { every, last, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addPadding, paddingOf, padTiles } from './add-padding';

const SKY_HEIGHT = 20;

const row = (tile: number): number[] => times(4, () => tile);

const ground = (): number[][] => [row(TILE_AIR), row(TILE_DIRT)];

describe('paddingOf', () => {
  it('should reach for enough bedrock to bury the lowest filled row', () => {
    expect(paddingOf(ground())).toEqual({ sky: SKY_HEIGHT, depth: 4 });
  });

  it('should ask for no bedrock under a level that is already deep enough', () => {
    expect(
      paddingOf([
        row(TILE_DIRT),
        row(TILE_AIR),
        ...times(4, () => row(TILE_AIR)),
      ]).depth,
    ).toBe(0);
  });
});

describe('padTiles', () => {
  it('should hang the sky above and the bedrock below', () => {
    const padded = padTiles(ground(), paddingOf(ground()));

    expect(size(padded)).toBe(SKY_HEIGHT + 2 + 4);
    expect(
      every(padded.slice(0, SKY_HEIGHT), (cells) =>
        every(cells, (tile) => tile === TILE_AIR),
      ),
    ).toBe(true);
    expect(last(padded)).toEqual(row(TILE_DIRT));
  });

  it('should give a second layer the padding measured off the first, so the two stay the same shape', () => {
    const front = ground();
    const back = [row(TILE_DIRT), row(TILE_AIR)];
    const padding = paddingOf(front);

    expect(map(padTiles(back, padding), size)).toEqual(
      map(padTiles(front, padding), size),
    );
    expect(size(padTiles(back, padding))).toBe(size(padTiles(front, padding)));
  });

  it('should leave an empty grid empty', () => {
    expect(padTiles([], paddingOf([]))).toEqual([]);
  });
});

describe('addPadding', () => {
  it('should pad a grid by its own measure', () => {
    expect(addPadding(ground())).toEqual(
      padTiles(ground(), paddingOf(ground())),
    );
  });
});
