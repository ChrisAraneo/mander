import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { patchPlayingInteraction } from './patch-playing-interaction';
import { patchPortalInteraction } from './patch-portal-interaction';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  score: 500,
  time: 12.4,
  levelTimes: [30],
  isNearPortal: true,
});

describe('patchPlayingInteraction', () => {
  it('should open the chest when the player stands by it holding the key', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      hasKey: true,
    };

    const interacted = patchPlayingInteraction(state);

    expect(interacted).toEqual({ ...state, status: 'CHEST' });
  });

  it('should try the portal when the player stands by the chest without the key', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      hasKey: false,
    };

    const interacted = patchPlayingInteraction(state);

    expect(interacted).toEqual(patchPortalInteraction(state));
  });

  it('should try the portal when the player holds the key away from the chest', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: false,
      hasKey: true,
    };

    const interacted = patchPlayingInteraction(state);

    expect(interacted).toEqual(patchPortalInteraction(state));
  });
});
