import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import { createPlayer } from './create-player';
import { getSpawnPosition } from './get-spawn-position';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = ['.....', '.....', '.....', '..S..', '#####'];

const createLevel = (): GameLevel => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel();

describe('createPlayer', () => {
  it('should place a fresh player at the spawn with the given hearts when a level starts', () => {
    const player = createPlayer(LEVEL, { hearts: { value: 4 } });

    expect(player).toEqual({
      position: getSpawnPosition(LEVEL),
      velocity: createBasePlayerVelocity(),
      hearts: { value: 4 },
      timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
      statuses: {
        isFacingRight: true,
        isGrounded: false,
        isJumpQueued: false,
      },
    });
  });

  it('should give the player hearts of its own when it is given the hearts of another player', () => {
    const hearts = { value: 4 };

    const player = createPlayer(LEVEL, { hearts });

    expect(player.hearts).not.toBe(hearts);
  });

  it('should leave the level unchanged when it creates the player', () => {
    const level = createLevel();

    createPlayer(level, { hearts: { value: 4 } });

    expect(level).toEqual(createLevel());
  });
});
