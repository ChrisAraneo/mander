import {
  type Enemy,
  type Fireball,
  type Item,
  MOON_MAGNET,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import type { GameLevel } from '../../types/game-level';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../enemy/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { playerCentre } from '../player/player-centre';
import { tick } from '../tick/tick';
import { advancePlayerFireballs } from './advance-player-fireballs';
import { burnEnemies } from './burn-enemies';
import { PLAYER_FIREBALL_ORBIT_RADIUS } from './consts';
import { createPlayerFireballs } from './create-player-fireballs';
import { playerFireballPosition } from './player-fireball-position';
import { startingFireballs } from './starting-fireballs';

const DELTA_SECONDS = 1 / 60;

const trinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const player = (x = 0, y = 0): Player => ({
  position: { x, y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});

const enemy = (x: number, y: number, death: number | null = null): Enemy => ({
  kind: 'HOPPING',
  position: { x, y },
  velocity: createBasePlayerVelocity(),
  timers: { death },
  spawn: { x, y },
  statuses: { isFacingRight: true, isGrounded: true },
});

const radiusOf = (fireball: Fireball): number => {
  const orbiting = playerFireballPosition(fireball);

  return Math.hypot(
    orbiting.x - fireball.origin.x,
    orbiting.y - fireball.origin.y,
  );
};

const enemyUnder = (fireball: Fireball, death: number | null = null): Enemy => {
  const orbiting = playerFireballPosition(fireball);

  return enemy(
    orbiting.x - ENEMY_WIDTH / 2,
    orbiting.y - ENEMY_HEIGHT / 2,
    death,
  );
};

const isDying = (victim: Enemy): boolean => victim.timers.death !== null;

const WIDTH = 14;
const SPAWN_COLUMN = 2;

const airRow = (): Tile[] => times(WIDTH, () => TILE_AIR);

const groundLevel = (): GameLevel => ({
  seed: 'ORBIT-LEVEL',
  width: WIDTH,
  height: 4,
  tiles: [
    airRow(),
    airRow(),
    times(WIDTH, (x) => (x === SPAWN_COLUMN ? TILE_SPAWN : TILE_AIR)),
    times(WIDTH, () => TILE_DIRT),
  ],
  chestItems: [],
  hornedEnemyChance: 0,
});

const carrying = (...items: Item[]): GameState =>
  createInitialState(groundLevel(), 0, items);

const withEnemyOn = (state: GameState, fireball: Fireball): GameState => ({
  ...state,
  enemies: [enemyUnder(fireball)],
});

const dying = (state: GameState): GameState => ({
  ...state,
  player: { ...state.player, timers: { ...state.player.timers, death: 0 } },
});

describe('the fireballs that circle the player', () => {
  const STANDING = player(3 * TILE_SIZE, 5 * TILE_SIZE);

  it('gives the player none without the magnet in the pack', () => {
    expect(createPlayerFireballs([], STANDING)).toEqual([]);
    expect(createPlayerFireballs([trinket('GEM')], STANDING)).toEqual([]);
  });

  it('lights the two the magnet promises', () => {
    expect(startingFireballs([MOON_MAGNET])).toBe(2);
    expect(createPlayerFireballs([MOON_MAGNET], STANDING)).toHaveLength(2);
  });

  it('counts what every magnet the player carries is worth', () => {
    expect(startingFireballs([MOON_MAGNET, trinket('GEM'), MOON_MAGNET])).toBe(
      4,
    );
  });

  it('hangs them on opposite sides of the player', () => {
    const [first, second] = createPlayerFireballs([MOON_MAGNET], STANDING);

    expect(Math.abs(second.angle - first.angle)).toBeCloseTo(Math.PI);
  });

  it('hangs them off the player rather than off a block in the level', () => {
    for (const fireball of createPlayerFireballs([MOON_MAGNET], STANDING)) {
      expect(fireball.origin).toEqual(playerCentre(STANDING));
    }
  });

  it('holds each one a fixed distance out from the player', () => {
    for (const fireball of createPlayerFireballs([MOON_MAGNET], STANDING)) {
      expect(radiusOf(fireball)).toBeCloseTo(PLAYER_FIREBALL_ORBIT_RADIUS);
    }
  });

  it('circles them closer in than the fireballs bolted to the level', () => {
    expect(PLAYER_FIREBALL_ORBIT_RADIUS).toBeLessThan(5 * TILE_SIZE);
  });

  it('turns them as time passes', () => {
    const [before] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const [after] = advancePlayerFireballs([before], STANDING, DELTA_SECONDS);

    expect(after.angle).toBeGreaterThan(before.angle);
  });

  it('carries them along wherever the player walks', () => {
    const walked = player(
      STANDING.position.x + TILE_SIZE,
      STANDING.position.y - TILE_SIZE,
    );
    const [followed] = advancePlayerFireballs(
      createPlayerFireballs([MOON_MAGNET], STANDING),
      walked,
      DELTA_SECONDS,
    );

    expect(followed.origin).toEqual(playerCentre(walked));
  });

  it('burns the enemy one of them sweeps through', () => {
    const [fireball] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const [swept] = burnEnemies([fireball], [enemyUnder(fireball)]);

    expect(isDying(swept)).toBe(true);
  });

  it('leaves the enemy standing well clear of the orbit alone', () => {
    const fireballs = createPlayerFireballs([MOON_MAGNET], STANDING);
    const far = enemy(
      STANDING.position.x + 10 * TILE_SIZE,
      STANDING.position.y,
    );

    expect(burnEnemies(fireballs, [far])).toEqual([far]);
  });

  it('burns nothing at all when the player carries no magnet', () => {
    const [fireball] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const victim = enemyUnder(fireball);

    expect(burnEnemies([], [victim])).toEqual([victim]);
  });

  it('leaves an enemy already dying to its own death', () => {
    const [fireball] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const fading = enemyUnder(fireball, 0.2);

    expect(burnEnemies([fireball], [fading])).toEqual([fading]);
  });

  it('sets them circling the player from the very first tick', () => {
    expect(
      tick(carrying(MOON_MAGNET), DELTA_SECONDS).playerFireballs,
    ).toHaveLength(2);
    expect(tick(carrying(), DELTA_SECONDS).playerFireballs).toEqual([]);
  });

  it('keeps them circling and following as the game ticks along', () => {
    const state = carrying(MOON_MAGNET);
    const ticked = tick(state, DELTA_SECONDS);

    expect(map(ticked.playerFireballs, 'angle')).not.toEqual(
      map(state.playerFireballs, 'angle'),
    );
    expect(ticked.playerFireballs[0].origin).toEqual(
      playerCentre(ticked.player),
    );
  });

  it('burns an enemy caught on the orbit as the game ticks along', () => {
    const state = carrying(MOON_MAGNET);
    const caught = withEnemyOn(state, state.playerFireballs[0]);

    expect(isDying(tick(caught, DELTA_SECONDS).enemies[0])).toBe(true);
  });

  it('burns nothing while the player lies dying', () => {
    const state = carrying(MOON_MAGNET);
    const caught = dying(withEnemyOn(state, state.playerFireballs[0]));

    expect(isDying(tick(caught, DELTA_SECONDS).enemies[0])).toBe(false);
  });

  it('leaves the fireballs bolted to the level burning where they are', () => {
    const state = carrying(MOON_MAGNET);

    expect(tick(state, DELTA_SECONDS).fireballs).toEqual(state.fireballs);
  });
});
