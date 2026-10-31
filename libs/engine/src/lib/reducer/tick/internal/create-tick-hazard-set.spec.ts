import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Snowball,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createTickHazardSet } from './create-tick-hazard-set';
import type { TickHazardSet } from './types/tick-hazard-set';

const ENEMIES = [{ kind: 'HOPPING' }] as unknown as Enemy[];

const CANNONS = [{ isFacingRight: true }] as unknown as Cannon[];

const CANNONBALLS = [{ position: { x: 1, y: 2 } }] as unknown as Cannonball[];

const SNOWBALLS = [{ position: { x: 7, y: 8 } }] as unknown as Snowball[];

const FALLING_SPIKES = [
  { position: { x: 3, y: 4 } },
] as unknown as FallingSpike[];

const FIREBALLS = [{ angle: 0 }] as unknown as Fireball[];

const BULLETS = [{ position: { x: 5, y: 6 } }] as unknown as Bullet[];

const createHazards = (): TickHazardSet =>
  createTickHazardSet(
    ENEMIES,
    { cannons: CANNONS, cannonballs: CANNONBALLS },
    SNOWBALLS,
    FALLING_SPIKES,
    FIREBALLS,
    BULLETS,
  );

describe('createTickHazardSet', () => {
  it('should carry the stepped enemies on when it gathers the hazards', () => {
    expect(createHazards().steppedEnemies).toBe(ENEMIES);
  });

  it('should carry the cannons of the barrage on when it gathers the hazards', () => {
    expect(createHazards().cannons).toBe(CANNONS);
  });

  it('should keep the cannonballs of the barrage flying when it gathers the hazards', () => {
    expect(createHazards().flying).toBe(CANNONBALLS);
  });

  it('should keep the snowballs flying when it gathers the hazards', () => {
    expect(createHazards().snowballs).toBe(SNOWBALLS);
  });

  it('should carry the falling spikes, fireballs and bullets on when it gathers the hazards', () => {
    const hazards = createHazards();

    expect(hazards.fallingSpikes).toBe(FALLING_SPIKES);
    expect(hazards.fireballs).toBe(FIREBALLS);
    expect(hazards.flyingBullets).toBe(BULLETS);
  });

  it('should hold nothing when every hazard is gone', () => {
    const hazards = createTickHazardSet(
      [],
      { cannons: [], cannonballs: [] },
      [],
      [],
      [],
      [],
    );

    expect(hazards).toEqual({
      steppedEnemies: [],
      cannons: [],
      flying: [],
      snowballs: [],
      fallingSpikes: [],
      fireballs: [],
      flyingBullets: [],
    });
  });
});
