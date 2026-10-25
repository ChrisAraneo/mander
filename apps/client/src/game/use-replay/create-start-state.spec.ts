import { createInitialState, type GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createStartState } from './create-start-state';

const createLevel = (seed: string): GameLevel => ({
  seed,
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
});

describe('createStartState', () => {
  it('should open on the first level when it starts a world', () => {
    expect(
      createStartState([createLevel('FIRST'), createLevel('SECOND')], 0).level
        .seed,
    ).toBe('FIRST');
  });

  it('should carry the score when the world was started with one', () => {
    expect(createStartState([createLevel('FIRST')], 450).score).toBe(450);
  });

  it('should start like a fresh level when it starts a world', () => {
    const level = createLevel('FIRST');

    expect(createStartState([level], 0)).toEqual(
      createInitialState(level, 0, []),
    );
  });
});
