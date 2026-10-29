import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { computePlayerFeet } from './compute-player-feet';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: 40, y: top },
});

describe('computePlayerFeet', () => {
  it('should find the bottom of the player when the player stands in the level', () => {
    const player = createPlayerAt(56);

    const feet = computePlayerFeet(player);

    expect(feet).toBe(104);
  });

  it('should find the bottom of the player when the player is at the top of the level', () => {
    const player = createPlayerAt(0);

    const feet = computePlayerFeet(player);

    expect(feet).toBe(48);
  });
});
