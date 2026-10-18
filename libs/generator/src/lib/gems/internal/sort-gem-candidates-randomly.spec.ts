import { createRandom } from '@mander/engine';
import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { chunk, map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import { sortGemCandidatesRandomly } from './sort-gem-candidates-randomly';

const WIDTH = 12;

const LEVEL: Tile[][] = [
  times(WIDTH, () => TILE_AIR),
  times(WIDTH, () => TILE_DIRT),
];

const SLOTS = chunk(
  map(range(WIDTH), (column) => ({ row: 1, column })),
  4,
);

const RANDOM = createRandom('SEED');

const sortRandomlyIn = (levelType: LevelType, seed: string) =>
  sortGemCandidatesRandomly({
    tiles: LEVEL,
    levelType,
    slots: SLOTS,
    random: createRandom(seed),
  }).slots;

describe('sortGemCandidatesRandomly', () => {
  it('should keep every candidate in its slot when it shuffles a horizontal level', () => {
    expect(
      map(sortRandomlyIn('HORIZONTAL', 'DAY-1'), (slot) =>
        sortBy(slot, 'column'),
      ),
    ).toEqual(SLOTS);
  });

  it('should keep every candidate in its slot when it shuffles a vertical level', () => {
    expect(
      map(sortRandomlyIn('VERTICAL', 'DAY-1'), (slot) =>
        sortBy(slot, 'column'),
      ),
    ).toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles a horizontal level', () => {
    expect(sortRandomlyIn('HORIZONTAL', 'DAY-1')).not.toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles a vertical level', () => {
    expect(sortRandomlyIn('VERTICAL', 'DAY-1')).not.toEqual(SLOTS);
  });

  it('should shuffle the candidates the same way when the generator starts from the same seed', () => {
    expect(sortRandomlyIn('HORIZONTAL', 'DAY-1')).toEqual(
      sortRandomlyIn('HORIZONTAL', 'DAY-1'),
    );
  });

  it('should shuffle the candidates another way when the generator starts from another seed', () => {
    expect(sortRandomlyIn('HORIZONTAL', 'DAY-1')).not.toEqual(
      sortRandomlyIn('HORIZONTAL', 'DAY-2'),
    );
  });

  it('should give no slots when it gets no slots', () => {
    expect(
      sortGemCandidatesRandomly({
        tiles: LEVEL,
        levelType: 'VERTICAL',
        slots: [],
        random: RANDOM,
      }).slots,
    ).toEqual([]);
  });

  it('should keep the grid the same when it shuffles', () => {
    expect(
      sortGemCandidatesRandomly({
        tiles: LEVEL,
        levelType: 'VERTICAL',
        slots: [],
        random: RANDOM,
      }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the level type on when it shuffles', () => {
    expect(
      sortGemCandidatesRandomly({
        tiles: LEVEL,
        levelType: 'VERTICAL',
        slots: [],
        random: RANDOM,
      }).levelType,
    ).toBe('VERTICAL');
  });
});
