import { type Bullet, type Level, TILE_SIZE } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BULLET_SPEED } from '../consts';
import { patchBulletFlight } from './patch-bullet-flight';

const TICK_SECONDS = 0.02;
const FIRST_LEFT = 100;
const SECOND_LEFT = 200;

const LEVEL: Level = {
  seed: 'SEED',
  width: 0,
  height: 0,
  tiles: [],
  chestItems: [],
};

const createBulletAt = (left: number, speed: number): Bullet => ({
  position: { x: left, y: TILE_SIZE },
  velocity: { x: { current: speed, max: BULLET_SPEED } },
});

const createBullets = (): Bullet[] => [
  createBulletAt(FIRST_LEFT, BULLET_SPEED),
  createBulletAt(SECOND_LEFT, -BULLET_SPEED),
];

describe('patchBulletFlight', () => {
  it('should move every bullet along by its speed when the tick is given', () => {
    const flight = patchBulletFlight({
      bullets: createBullets(),
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(map(flight.bullets, (bullet) => bullet.position.x)).toEqual([
      FIRST_LEFT + BULLET_SPEED * TICK_SECONDS,
      SECOND_LEFT - BULLET_SPEED * TICK_SECONDS,
    ]);
  });

  it('should give no bullets when it is given none', () => {
    const flight = patchBulletFlight({
      bullets: [],
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(flight.bullets).toEqual([]);
  });

  it('should pass the level on when it moves the bullets', () => {
    const flight = patchBulletFlight({
      bullets: createBullets(),
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(flight.level).toBe(LEVEL);
  });

  it('should not change the bullets it was given when it moves them', () => {
    const bullets = createBullets();

    patchBulletFlight({ bullets, level: LEVEL, tickSeconds: TICK_SECONDS });

    expect(bullets).toEqual(createBullets());
  });
});
