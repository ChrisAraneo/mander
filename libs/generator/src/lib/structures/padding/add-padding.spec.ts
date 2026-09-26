import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { every, last, map, size, takeRight, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addPadding } from './add-padding';

const SKY_HEIGHT = 20;

const row = (tile: number): number[] => times(4, () => tile);

const ground = (): number[][] => [row(TILE_AIR), row(TILE_DIRT)];

describe('addPadding', () => {
  it('should hang the sky above and the bedrock below when it pads a grid', () => {
    const padded = addPadding(ground());

    expect(size(padded)).toBe(SKY_HEIGHT + 2 + 4);
    expect(
      every(padded.slice(0, SKY_HEIGHT), (cells) =>
        every(cells, (tile) => tile === TILE_AIR),
      ),
    ).toBe(true);
    expect(last(padded)).toEqual(row(TILE_DIRT));
  });

  it('should reach for enough bedrock to bury the lowest filled row when the level is shallow', () => {
    expect(takeRight(addPadding(ground()), 4)).toEqual(
      times(4, () => row(TILE_DIRT)),
    );
  });

  it('should add no bedrock when the level is already deep enough', () => {
    const tiles = [row(TILE_DIRT), ...times(5, () => row(TILE_AIR))];

    expect(size(addPadding(tiles))).toBe(SKY_HEIGHT + size(tiles));
  });

  it('should measure the grid itself when it gets no front layer', () => {
    expect(addPadding(ground())).toEqual(addPadding(ground(), ground()));
  });

  it('should measure the padding off the front layer when it pads the back one, so the two stay the same shape', () => {
    const front = ground();
    const back = [row(TILE_DIRT), row(TILE_AIR)];

    expect(map(addPadding(back, front), size)).toEqual(
      map(addPadding(front), size),
    );
    expect(size(addPadding(back, front))).toBe(size(addPadding(front)));
  });

  it('should leave the grid empty when there is nothing on it', () => {
    expect(addPadding([])).toEqual([]);
  });

  it('should not change the old grid when it pads it', () => {
    const tiles = ground();

    addPadding(tiles);

    expect(tiles).toEqual(ground());
  });
});
