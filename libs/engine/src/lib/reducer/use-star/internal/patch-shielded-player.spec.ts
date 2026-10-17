import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { STAR_INVINCIBLE_SECONDS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { patchShieldedPlayer } from './patch-shielded-player';

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
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createTimedPlayer = (invincibility: number, star: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  timers: { death: null, invincibility, star, hurt: 0.5 },
});

describe('patchShieldedPlayer', () => {
  it('should make the player invincible for the star time when the player has no shield', () => {
    const player = createTimedPlayer(0, 0);

    const patched = patchShieldedPlayer(player);

    expect(patched).toEqual({
      ...player,
      timers: {
        death: null,
        invincibility: STAR_INVINCIBLE_SECONDS,
        star: STAR_INVINCIBLE_SECONDS,
        hurt: 0.5,
      },
    });
  });

  it('should keep the longer timers when the player is already invincible for longer', () => {
    const player = createTimedPlayer(5, 4);

    const patched = patchShieldedPlayer(player);

    expect(patched.timers.invincibility).toBe(5);
    expect(patched.timers.star).toBe(4);
  });

  it('should raise only the shorter timer when one timer already lasts longer than the star time', () => {
    const player = createTimedPlayer(1, 4);

    const patched = patchShieldedPlayer(player);

    expect(patched.timers.invincibility).toBe(STAR_INVINCIBLE_SECONDS);
    expect(patched.timers.star).toBe(4);
  });

  it('should leave the given player unchanged when the player is shielded', () => {
    const player = createTimedPlayer(0, 0);

    patchShieldedPlayer(player);

    expect(player).toEqual(createTimedPlayer(0, 0));
  });
});
