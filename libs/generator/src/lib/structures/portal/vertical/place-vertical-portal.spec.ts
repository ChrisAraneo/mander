import {
  PORTAL_HEIGHT,
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_PORTAL,
  type Tile,
} from '@mander/model';
import { filter, flatten, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { placeVerticalPortal } from './place-vertical-portal';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  P: TILE_PORTAL,
};

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const OPEN_LEVEL = ['.....', '.....', '#####'];

describe('placeVerticalPortal', () => {
  it('should put the portal in the middle column when the whole floor is free', () => {
    expect(placeVerticalPortal(grid(OPEN_LEVEL))).toEqual(
      grid(['..P..', '..P..', '#####']),
    );
  });

  it('should stand the portal on the highest floor when the level has more than one', () => {
    expect(
      placeVerticalPortal(
        grid(['.....', '.....', '#####', '.....', '.....', '#####']),
      ),
    ).toEqual(grid(['..P..', '..P..', '#####', '.....', '.....', '#####']));
  });

  it('should take the column nearest the middle when something is in the way of the middle one', () => {
    expect(placeVerticalPortal(grid(['.....', '..o..', '#####']))).toEqual(
      grid(['.P...', '.Po..', '#####']),
    );
  });

  it('should pick a lower floor when the highest one has no room for the portal', () => {
    expect(
      placeVerticalPortal(grid(['...', '###', '...', '...', '###'])),
    ).toEqual(grid(['...', '###', '.P.', '.P.', '###']));
  });

  it('should make the portal as tall as the portal height when it places one', () => {
    expect(
      filter(
        flatten(placeVerticalPortal(grid(OPEN_LEVEL))),
        (tile) => tile === TILE_PORTAL,
      ),
    ).toHaveLength(PORTAL_HEIGHT);
  });

  it('should leave the grid alone when there is nowhere to stand', () => {
    expect(placeVerticalPortal(grid(['...', '...', '...']))).toEqual(
      grid(['...', '...', '...']),
    );
  });

  it('should give back an empty grid when it gets one', () => {
    expect(placeVerticalPortal([])).toEqual([]);
  });

  it('should not change the old grid when it places the portal', () => {
    const tiles = grid(OPEN_LEVEL);

    placeVerticalPortal(tiles);

    expect(tiles).toEqual(grid(OPEN_LEVEL));
  });
});
