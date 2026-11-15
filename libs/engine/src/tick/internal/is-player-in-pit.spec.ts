import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { PIT_DEPTH_TILES } from '../consts';
import { isPlayerInPit } from './is-player-in-pit';

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

const LEVEL = createLevel(['.....', '.....', 's....', '##.##']);

const HEARTS = 3;

const ONE_PIXEL = 1;

const PLAYER_COLUMN = 2;

const PIT_DEPTH = (LEVEL.height + PIT_DEPTH_TILES) * TILE_SIZE;

const INSIDE_LEVEL_Y = TILE_SIZE;

const createPlayerAt = (top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: HEARTS } }),
  position: { x: PLAYER_COLUMN * TILE_SIZE, y: top },
});

describe('isPlayerInPit', () => {
  it('should say yes when the player has fallen more than three tiles below the level', () => {
    const player = createPlayerAt(PIT_DEPTH + ONE_PIXEL);

    const isInPit = isPlayerInPit(LEVEL, player);

    expect(isInPit).toBe(true);
  });

  it('should say no when the player is exactly three tiles below the level', () => {
    const player = createPlayerAt(PIT_DEPTH);

    const isInPit = isPlayerInPit(LEVEL, player);

    expect(isInPit).toBe(false);
  });

  it('should say no when the player is inside the level', () => {
    const player = createPlayerAt(INSIDE_LEVEL_Y);

    const isInPit = isPlayerInPit(LEVEL, player);

    expect(isInPit).toBe(false);
  });
});
