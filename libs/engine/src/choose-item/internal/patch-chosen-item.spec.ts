import { type Item, RED_GEM, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchChosenItem } from './patch-chosen-item';
import { patchTakenItem } from './patch-taken-item';

const FIRST_ITEM: Item = {
  id: 'FIRST',
  name: 'First',
  description: 'Offered first in the chest',
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
};

const LEVEL: GameLevel = {
  seed: 'TEST',
  width: 1,
  height: 1,
  tiles: [[TILE_DIRT]],
  chestItems: [FIRST_ITEM, RED_GEM],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
};

const createState = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  status: 'CHEST',
  isNearChest: true,
});

describe('patchChosenItem', () => {
  it('should take the item at the given place when the chest offers it', () => {
    const state = createState();

    const chosen = patchChosenItem(state, 1);

    expect(chosen).toEqual(patchTakenItem(state, RED_GEM));
  });

  it('should change nothing when the place is before the first item', () => {
    const state = createState();

    const chosen = patchChosenItem(state, -1);

    expect(chosen).toBe(state);
  });

  it('should change nothing when the place is past the last item', () => {
    const state = createState();

    const chosen = patchChosenItem(state, 2);

    expect(chosen).toBe(state);
  });

  it('should not change the game it was handed when it takes the item', () => {
    const state = createState();

    patchChosenItem(state, 1);

    expect(state).toEqual(createState());
  });
});
