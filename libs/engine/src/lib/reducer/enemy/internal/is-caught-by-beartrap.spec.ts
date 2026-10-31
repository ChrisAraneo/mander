import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createBeartraps } from './create-beartraps';
import { createPatrols } from './create-patrols';
import { isCaughtByBeartrap } from './is-caught-by-beartrap';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  b: TILE_BEARTRAP,
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

const LEVEL = createLevel(['.....', '.e.b.', '#####']);

const createTrapAt = (left: number, top: number): Enemy => ({
  ...createBeartraps(LEVEL)[0],
  position: { x: left, y: top },
});

const createPreyAt = (left: number, top: number): Enemy => ({
  ...createPatrols(LEVEL)[0],
  position: { x: left, y: top },
});

describe('isCaughtByBeartrap', () => {
  it('should say yes when a living enemy stands inside a beartrap', () => {
    const traps = [createTrapAt(100, 100)];
    const prey = createPreyAt(110, 100);

    const isCaught = isCaughtByBeartrap(traps, prey);

    expect(isCaught).toBe(true);
  });

  it('should say yes when a living enemy stands inside the second of two beartraps', () => {
    const traps = [createTrapAt(300, 100), createTrapAt(100, 100)];
    const prey = createPreyAt(110, 100);

    const isCaught = isCaughtByBeartrap(traps, prey);

    expect(isCaught).toBe(true);
  });

  it('should say no when the enemy inside the beartrap is dying', () => {
    const traps = [createTrapAt(100, 100)];
    const prey: Enemy = {
      ...createPreyAt(110, 100),
      timers: { death: 0.1, reload: 0 },
    };

    const isCaught = isCaughtByBeartrap(traps, prey);

    expect(isCaught).toBe(false);
  });

  it('should say no when the enemy inside the beartrap is itself a beartrap', () => {
    const traps = [createTrapAt(100, 100)];
    const prey = createTrapAt(110, 100);

    const isCaught = isCaughtByBeartrap(traps, prey);

    expect(isCaught).toBe(false);
  });

  it('should say no when the enemy stands clear of every beartrap', () => {
    const traps = [createTrapAt(100, 100), createTrapAt(300, 100)];
    const prey = createPreyAt(200, 100);

    const isCaught = isCaughtByBeartrap(traps, prey);

    expect(isCaught).toBe(false);
  });

  it('should say no when there are no beartraps', () => {
    const prey = createPreyAt(110, 100);

    const isCaught = isCaughtByBeartrap([], prey);

    expect(isCaught).toBe(false);
  });
});
