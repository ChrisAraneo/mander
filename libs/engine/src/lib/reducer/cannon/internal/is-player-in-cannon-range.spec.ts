import {
  type Cannon,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { isPlayerInCannonRange } from './is-player-in-cannon-range';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number, top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: top },
});

const CANNON: Cannon = {
  position: { x: 320, y: 64 },
  timers: { reload: 0 },
  statuses: { isFacingRight: true },
};

describe('isPlayerInCannonRange', () => {
  it('should say yes when the player stands near the cannon', () => {
    const isInRange = isPlayerInCannonRange(CANNON, createPlayerAt(400, 56));

    expect(isInRange).toBe(true);
  });

  it('should say yes when the centre of the player is exactly at the far end of the range to the side', () => {
    const isInRange = isPlayerInCannonRange(CANNON, createPlayerAt(965, 56));

    expect(isInRange).toBe(true);
  });

  it('should say no when the centre of the player is just beyond the range to the side', () => {
    const isInRange = isPlayerInCannonRange(CANNON, createPlayerAt(966, 56));

    expect(isInRange).toBe(false);
  });

  it('should say yes when the centre of the player is exactly at the far end of the range below', () => {
    const isInRange = isPlayerInCannonRange(CANNON, createPlayerAt(325, 696));

    expect(isInRange).toBe(true);
  });

  it('should say no when the centre of the player is just beyond the range below', () => {
    const isInRange = isPlayerInCannonRange(CANNON, createPlayerAt(325, 697));

    expect(isInRange).toBe(false);
  });
});
