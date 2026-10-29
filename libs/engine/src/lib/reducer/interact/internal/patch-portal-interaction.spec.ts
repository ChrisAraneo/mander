import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  score: 500,
  time: 12.4,
  levelTimes: [30],
});

describe('patchPortalInteraction', () => {
  it('should finish the level when the player stands by the portal', () => {
    const state: GameState = { ...createState(), isNearPortal: true };

    const interacted = patchPortalInteraction(state);

    expect(interacted.status).toBe('COMPLETE');
    expect(interacted.score).toBe(500 + 8800);
    expect(interacted.levelTimes).toEqual([30, 12.4]);
  });

  it('should hand back the same state when the player is away from the portal', () => {
    const state = createState();

    const interacted = patchPortalInteraction(state);

    expect(interacted).toBe(state);
  });
});
