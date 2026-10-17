import {
  type Item,
  MOON_MAGNET,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { createPlayerFireballs } from '../fireball/create-player-fireballs';
import { handleToggleMoonMagnet } from './handle-toggle-moon-magnet';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = ['.....', '.S...', '#####'];

const createLevel = (): GameLevel => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const createTrinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createState = (inventory: Item[] = [MOON_MAGNET]): GameState =>
  createInitialState(createLevel(), 0, inventory);

const createDarkState = (): GameState => ({
  ...createState(),
  isMoonMagnetOn: false,
  playerFireballs: [],
});

describe('handleToggleMoonMagnet', () => {
  it('should turn the magnet off and send the moons away when the player owns it and is playing', () => {
    const state = createState();

    const toggled = handleToggleMoonMagnet(state);

    expect(toggled.isMoonMagnetOn).toBe(false);
    expect(toggled.playerFireballs).toEqual([]);
  });

  it('should turn the magnet on and bring the moons back around the player when it was off', () => {
    const state = createDarkState();

    const toggled = handleToggleMoonMagnet(state);

    expect(toggled.isMoonMagnetOn).toBe(true);
    expect(toggled.playerFireballs).toEqual(
      createPlayerFireballs([MOON_MAGNET], state.player, true),
    );
  });

  it('should leave the state alone when the player owns no magnet', () => {
    const state = createState([createTrinket('GEM')]);

    const toggled = handleToggleMoonMagnet(state);

    expect(toggled).toBe(state);
  });

  it('should leave the state alone when the player carries nothing', () => {
    const state = createState([]);

    const toggled = handleToggleMoonMagnet(state);

    expect(toggled).toBe(state);
  });

  it('should leave the state alone when the chest is open', () => {
    const state: GameState = { ...createState(), status: 'CHEST' };

    const toggled = handleToggleMoonMagnet(state);

    expect(toggled).toBe(state);
  });

  it('should leave the state alone when the run has already ended', () => {
    const lost: GameState = { ...createState(), status: 'GAME_OVER' };
    const won: GameState = { ...createState(), status: 'COMPLETE' };

    expect(handleToggleMoonMagnet(lost)).toBe(lost);
    expect(handleToggleMoonMagnet(won)).toBe(won);
  });

  it('should leave the given state unchanged when the magnet is toggled', () => {
    const state = createState();

    handleToggleMoonMagnet(state);

    expect(state).toEqual(createState());
  });
});
