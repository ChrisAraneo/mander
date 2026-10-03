import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { chunk, map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import { shuffleGemCandidates } from './shuffle-gem-candidates';

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

const shuffleIn = (levelType: LevelType, seed: string) =>
  shuffleGemCandidates({
    tiles: LEVEL,
    levelType,
    random: createRandom(seed),
    slots: SLOTS,
  }).slots;

describe('shuffleGemCandidates', () => {
  it('should keep every candidate in its slot when it shuffles a horizontal level', () => {
    expect(
      map(shuffleIn('HORIZONTAL', 'DAY-1'), (slot) => sortBy(slot, 'column')),
    ).toEqual(SLOTS);
  });

  it('should keep every candidate in its slot when it shuffles a vertical level', () => {
    expect(
      map(shuffleIn('VERTICAL', 'DAY-1'), (slot) => sortBy(slot, 'column')),
    ).toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles a horizontal level', () => {
    expect(shuffleIn('HORIZONTAL', 'DAY-1')).not.toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles a vertical level', () => {
    expect(shuffleIn('VERTICAL', 'DAY-1')).not.toEqual(SLOTS);
  });

  it('should shuffle the candidates the same way when the generator starts from the same seed', () => {
    expect(shuffleIn('HORIZONTAL', 'DAY-1')).toEqual(
      shuffleIn('HORIZONTAL', 'DAY-1'),
    );
  });

  it('should shuffle the candidates another way when the generator starts from another seed', () => {
    expect(shuffleIn('HORIZONTAL', 'DAY-1')).not.toEqual(
      shuffleIn('HORIZONTAL', 'DAY-2'),
    );
  });

  it('should give no slots when it gets no slots', () => {
    expect(
      shuffleGemCandidates({
        tiles: LEVEL,
        levelType: 'VERTICAL',
        random: RANDOM,
        slots: [],
      }).slots,
    ).toEqual([]);
  });

  it('should keep the grid the same when it shuffles', () => {
    expect(
      shuffleGemCandidates({
        tiles: LEVEL,
        levelType: 'VERTICAL',
        random: RANDOM,
        slots: [],
      }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the level type on when it shuffles', () => {
    expect(
      shuffleGemCandidates({
        tiles: LEVEL,
        levelType: 'VERTICAL',
        random: RANDOM,
        slots: [],
      }).levelType,
    ).toBe('VERTICAL');
  });
});
