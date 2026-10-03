import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { every, last, map, size, take, takeRight, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SKY_HEIGHT } from '../consts';
import { addPadding } from './add-padding';

const WIDTH = 4;

const BEDROCK_DEPTH = 4;

const createRow = (tile: Tile): Tile[] => times(WIDTH, () => tile);

const createGround = (): Tile[][] => [
  createRow(TILE_AIR),
  createRow(TILE_DIRT),
];

describe('addPadding', () => {
  it('should hang the sky above and the bedrock below when it pads a grid', () => {
    const padded = addPadding(createGround());

    expect(size(padded)).toBe(
      SKY_HEIGHT + size(createGround()) + BEDROCK_DEPTH,
    );
    expect(
      every(take(padded, SKY_HEIGHT), (cells) =>
        every(cells, (tile) => tile === TILE_AIR),
      ),
    ).toBe(true);
    expect(last(padded)).toEqual(createRow(TILE_DIRT));
  });

  it('should reach for enough bedrock to bury the lowest filled row when the level is shallow', () => {
    expect(takeRight(addPadding(createGround()), BEDROCK_DEPTH)).toEqual(
      times(BEDROCK_DEPTH, () => createRow(TILE_DIRT)),
    );
  });

  it('should add no bedrock when the level is already deep enough', () => {
    const tiles = [
      createRow(TILE_DIRT),
      ...times(5, () => createRow(TILE_AIR)),
    ];

    expect(size(addPadding(tiles))).toBe(SKY_HEIGHT + size(tiles));
  });

  it('should measure the grid itself when it gets no front layer', () => {
    expect(addPadding(createGround())).toEqual(
      addPadding(createGround(), createGround()),
    );
  });

  it('should measure the padding off the front layer when it pads the back one, so the two stay the same shape', () => {
    const front = createGround();
    const back = [createRow(TILE_DIRT), createRow(TILE_AIR)];

    expect(map(addPadding(back, front), size)).toEqual(
      map(addPadding(front), size),
    );
    expect(size(addPadding(back, front))).toBe(size(addPadding(front)));
  });

  it('should leave the grid empty when there is nothing on it', () => {
    expect(addPadding([])).toEqual([]);
  });

  it('should not change the old grid when it pads it', () => {
    const tiles = createGround();

    addPadding(tiles);

    expect(tiles).toEqual(createGround());
  });
});
