import {
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_KEY,
  type Tile,
} from '@mander/model';
import { filter, flatten, map, repeat } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { KEY_HEIGHT } from '../../consts';
import type { LevelType } from '../get-level-type';
import { placeKey } from './place-key';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  K: TILE_KEY,
};

const WIDTH = 40;

const SEAM = 20;

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const createRow = (marks: Record<number, string> = {}, fill = '.'): string =>
  map([...repeat(fill, WIDTH)], (cell, column) => marks[column] ?? cell).join(
    '',
  );

const placeInRows = (rows: string[], levelType: LevelType) =>
  placeKey(createGrid(rows), levelType);

const HORIZONTAL_LEVEL = [createRow(), createRow({}, '#')];

const VERTICAL_LEVEL = ['...', '###', '...', '...', '...', '###', '...', '...'];

describe('placeKey', () => {
  it('should put the key on the seam between the middle structures of a horizontal level when the whole floor is free', () => {
    expect(placeInRows(HORIZONTAL_LEVEL, 'HORIZONTAL')).toEqual(
      createGrid([createRow({ [SEAM]: 'K' }), createRow({}, '#')]),
    );
  });

  it('should take the column left of the seam in a horizontal level when something is in the way of the seam', () => {
    expect(
      placeInRows(
        [createRow(), createRow({ [SEAM]: 'o' }), createRow({}, '#')],
        'HORIZONTAL',
      ),
    ).toEqual(
      createGrid([
        createRow(),
        createRow({ [SEAM - 1]: 'K', [SEAM]: 'o' }),
        createRow({}, '#'),
      ]),
    );
  });

  it('should stand the key on the ledge of a horizontal level when the seam column has one', () => {
    expect(
      placeInRows(
        [createRow(), createRow({ [SEAM]: '#' }), createRow({}, '#')],
        'HORIZONTAL',
      ),
    ).toEqual(
      createGrid([
        createRow({ [SEAM]: 'K' }),
        createRow({ [SEAM]: '#' }),
        createRow({}, '#'),
      ]),
    );
  });

  it('should put the key on the left of the floor nearest the middle row of a vertical level when it has more than one floor', () => {
    expect(placeInRows(VERTICAL_LEVEL, 'VERTICAL')).toEqual(
      createGrid(['...', '###', '...', '...', 'K..', '###', '...', '...']),
    );
  });

  it('should take the next spot on the same floor of a vertical level when something is in the way of the first one', () => {
    expect(
      placeInRows(
        ['...', '###', '...', '...', 'o..', '###', '...', '...'],
        'VERTICAL',
      ),
    ).toEqual(
      createGrid(['...', '###', '...', '...', 'oK.', '###', '...', '...']),
    );
  });

  it('should pick a floor further from the middle of a vertical level when the nearest one has no room', () => {
    expect(
      placeInRows(
        ['...', '###', '...', '...', 'ooo', '###', '...', '...'],
        'VERTICAL',
      ),
    ).toEqual(
      createGrid(['K..', '###', '...', '...', 'ooo', '###', '...', '...']),
    );
  });

  it('should make the key as tall as the key height in a horizontal level when it places one', () => {
    expect(
      filter(
        flatten(placeInRows(HORIZONTAL_LEVEL, 'HORIZONTAL')),
        (tile) => tile === TILE_KEY,
      ),
    ).toHaveLength(KEY_HEIGHT);
  });

  it('should make the key as tall as the key height in a vertical level when it places one', () => {
    expect(
      filter(
        flatten(placeInRows(VERTICAL_LEVEL, 'VERTICAL')),
        (tile) => tile === TILE_KEY,
      ),
    ).toHaveLength(KEY_HEIGHT);
  });

  it('should leave a horizontal level alone when no column has room', () => {
    expect(placeInRows(['...', '...', '...'], 'HORIZONTAL')).toEqual(
      createGrid(['...', '...', '...']),
    );
  });

  it('should leave a vertical level alone when there is nowhere to stand', () => {
    expect(placeInRows(['...', '...', '...'], 'VERTICAL')).toEqual(
      createGrid(['...', '...', '...']),
    );
  });

  it('should give back an empty horizontal level when it gets one', () => {
    expect(placeKey([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give back an empty vertical level when it gets one', () => {
    expect(placeKey([], 'VERTICAL')).toEqual([]);
  });

  it('should not change the old grid when it places the key', () => {
    const tiles = createGrid(HORIZONTAL_LEVEL);

    placeKey(tiles, 'HORIZONTAL');

    expect(tiles).toEqual(createGrid(HORIZONTAL_LEVEL));
  });
});
