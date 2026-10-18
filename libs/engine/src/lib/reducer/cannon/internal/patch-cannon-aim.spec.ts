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
import { patchCannonAim } from './patch-cannon-aim';

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

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 56 },
});

const createCannon = (isFacingRight: boolean): Cannon => ({
  position: { x: 320, y: 64 },
  timers: { reload: 2 },
  statuses: { isFacingRight },
});

describe('patchCannonAim', () => {
  it('should turn the cannon to the right when the player stands to its right', () => {
    const aimed = patchCannonAim(createCannon(false), createPlayerAt(400));

    expect(aimed.statuses).toEqual({ isFacingRight: true });
  });

  it('should turn the cannon to the left when the player stands to its left', () => {
    const aimed = patchCannonAim(createCannon(true), createPlayerAt(200));

    expect(aimed.statuses).toEqual({ isFacingRight: false });
  });

  it('should keep the same position when it turns the cannon', () => {
    const cannon = createCannon(false);

    const aimed = patchCannonAim(cannon, createPlayerAt(400));

    expect(aimed.position).toBe(cannon.position);
  });

  it('should keep the same reload timer when it turns the cannon', () => {
    const cannon = createCannon(false);

    const aimed = patchCannonAim(cannon, createPlayerAt(400));

    expect(aimed.timers).toBe(cannon.timers);
  });

  it('should leave the given cannon alone when it turns the cannon', () => {
    const cannon = createCannon(false);

    patchCannonAim(cannon, createPlayerAt(400));

    expect(cannon).toEqual(createCannon(false));
  });
});
