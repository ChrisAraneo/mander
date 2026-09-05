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
  it('sets no jaws of its own, on any level', () => {
    times(8, (index) => {
      const level = index + 1;

      expect(
        trapsIn(clearBeartraps(den(), level)),
        `level ${level}`,
      ).toBeLessThanOrEqual(trapsIn(den()));
    });
  });

  it('pulls the share each level was promised', () => {
    expect(leftOn(1)).toBe(JAWS * 0.5);
    expect(leftOn(2)).toBe(JAWS * 0.65);
    expect(leftOn(3)).toBe(JAWS * 0.8);
  });

  it('leaves every trap set from the fourth level on', () => {
    times(4, (index) => {
      const level = FIRST_UNTOUCHED_LEVEL + index;

      expect(clearBeartraps(den(), level), `level ${level}`).toEqual(den());
      expect(leftOn(level)).toBe(JAWS);
    });
  });

  it('thins a level the same way however often it is dealt', () => {
    times(3, (index) => {
      const level = index + 1;

      expect(clearBeartraps(trapline(), level)).toEqual(
        clearBeartraps(trapline(), level),
      );
    });
  });

  it('leaves air where it lifted a trap, and nothing else touched', () => {
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

  it('hands back a grid of its own rather than the one it was given', () => {
    const tiles = den();

    clearBeartraps(tiles, 1);
    clearBeartraps(tiles, FIRST_UNTOUCHED_LEVEL);

    expect(tiles).toEqual(den());
  });
});
