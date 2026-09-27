import { type Tile, TILE_AIR, TILE_BEARTRAP, TILE_DIRT } from '@mander/model';
import { filter, flatten, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { clearBeartraps } from './clear-beartraps';

const JAWS = 200;

const FIRST_UNTOUCHED_LEVEL = 4;

const trapline = (): Tile[][] => [
  times(JAWS, (): Tile => TILE_BEARTRAP),
  times(JAWS, (): Tile => TILE_DIRT),
];

const den = (): Tile[][] => [
  [TILE_AIR, TILE_BEARTRAP, TILE_AIR, TILE_BEARTRAP],
  [TILE_AIR, TILE_AIR, TILE_BEARTRAP, TILE_AIR],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const trapsIn = (tiles: Tile[][]): number =>
  size(filter(flatten(tiles), (tile) => tile === TILE_BEARTRAP));

const leftOn = (levelNumber: number): number =>
  trapsIn(clearBeartraps(trapline(), levelNumber));

describe('clearBeartraps', () => {
  it('should set no jaws of its own when it thins any level', () => {
    times(8, (index) => {
      const level = index + 1;

      expect(
        trapsIn(clearBeartraps(den(), level)),
        `level ${level}`,
      ).toBeLessThanOrEqual(trapsIn(den()));
    });
  });

  it('should pull the share the level was promised when it thins one', () => {
    expect(leftOn(1)).toBe(JAWS * 0.5);
    expect(leftOn(2)).toBe(JAWS * 0.65);
    expect(leftOn(3)).toBe(JAWS * 0.8);
  });

  it('should leave every trap set when the level is the fourth or later', () => {
    times(4, (index) => {
      const level = FIRST_UNTOUCHED_LEVEL + index;

      expect(clearBeartraps(den(), level), `level ${level}`).toEqual(den());
      expect(leftOn(level)).toBe(JAWS);
    });
  });

  it('should thin the level the same way when it is dealt again', () => {
    times(3, (index) => {
      const level = index + 1;

      expect(clearBeartraps(trapline(), level)).toEqual(
        clearBeartraps(trapline(), level),
      );
    });
  });

  it('should leave air behind and nothing else touched when it lifts a trap', () => {
    const lifted = clearBeartraps(den(), 1);

    expect(map(lifted[0], (tile) => tile === TILE_DIRT)).toEqual([
      false,
      false,
      false,
      false,
    ]);
    expect(lifted[2]).toEqual([TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT]);
    expect(
      filter(
        flatten(lifted),
        (tile) => tile !== TILE_AIR && tile !== TILE_DIRT,
      ),
    ).toEqual(times(trapsIn(lifted), (): Tile => TILE_BEARTRAP));
  });

  it('should hand back a grid of its own when it is given one to thin', () => {
    const tiles = den();

    clearBeartraps(tiles, 1);
    clearBeartraps(tiles, FIRST_UNTOUCHED_LEVEL);

    expect(tiles).toEqual(den());
  });
});
