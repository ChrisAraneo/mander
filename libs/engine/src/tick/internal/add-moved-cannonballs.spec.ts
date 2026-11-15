import {
  type Cannon,
  type Cannonball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, repeat, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SPEED } from '../../cannon/consts';
import { nextCannonballs } from '../../cannon/next-cannonballs';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { addMovedCannonballs } from './add-moved-cannonballs';

const DELTA_SECONDS = 0.02;

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
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
  freezingEnemyChance: 0,
});

const LEVEL = createLevel([
  repeat('.', 40),
  repeat('.', 40),
  `s${repeat('.', 39)}`,
  repeat('#', 40),
]);

const CANNON: Cannon = {
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: 320, y: 64 },
  timers: { reload: 10 },
  statuses: { isFacingRight: false },
};

const createCannonball = (left: number): Cannonball => ({
  position: { x: left, y: 10 },
  velocity: {
    x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    y: { current: 0, max: CANNONBALL_SPEED },
  },
});

const createState = (cannonballs: Cannonball[]): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  cannonballs,
});

describe('addMovedCannonballs', () => {
  it('should put the moved cannonballs of the game before the fired ones when a cannon fires', () => {
    const state = createState([createCannonball(100), createCannonball(1280)]);
    const fired = [createCannonball(330)];

    const barrage = addMovedCannonballs(
      { cannons: [CANNON], cannonballs: fired },
      state,
      DELTA_SECONDS,
    );

    expect(barrage.cannonballs).toEqual([
      ...nextCannonballs(state.cannonballs, LEVEL, DELTA_SECONDS),
      ...fired,
    ]);
    expect(size(barrage.cannonballs)).toBe(2);
  });

  it('should pass the same cannons on when the cannonballs move', () => {
    const cannons = [CANNON];

    const barrage = addMovedCannonballs(
      { cannons, cannonballs: [] },
      createState([]),
      DELTA_SECONDS,
    );

    expect(barrage.cannons).toBe(cannons);
  });

  it('should not change the old game when the cannonballs move', () => {
    const state = createState([createCannonball(100)]);

    addMovedCannonballs({ cannons: [], cannonballs: [] }, state, DELTA_SECONDS);

    expect(state).toEqual(createState([createCannonball(100)]));
  });

  it('should give no cannonballs when none are flying and none are fired', () => {
    const barrage = addMovedCannonballs(
      { cannons: [], cannonballs: [] },
      createState([]),
      DELTA_SECONDS,
    );

    expect(barrage).toEqual({ cannons: [], cannonballs: [] });
  });
});
