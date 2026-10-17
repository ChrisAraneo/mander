import type { Fireball } from '@mander/model';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFireballRing } from './create-fireball-ring';

const ORIGIN: Fireball['origin'] = { x: 100, y: 50 };

describe('createFireballRing', () => {
  it('should create the given number of clockwise fireballs when the ring has four fireballs', () => {
    const ring = createFireballRing(4, ORIGIN);

    expect(map(ring, (fireball) => fireball.spin)).toEqual(
      times(4, () => 'CLOCKWISE'),
    );
  });

  it('should share the same origin between the fireballs when the ring is created', () => {
    const ring = createFireballRing(4, ORIGIN);

    expect(ring[0].origin).toBe(ORIGIN);
    expect(ring[1].origin).toBe(ORIGIN);
    expect(ring[2].origin).toBe(ORIGIN);
    expect(ring[3].origin).toBe(ORIGIN);
  });

  it('should space the fireballs evenly around the ring when the ring has four fireballs', () => {
    const ring = createFireballRing(4, ORIGIN);

    expect(ring[0].angle).toBe(0);
    expect(ring[1].angle).toBeCloseTo(Math.PI / 2, 6);
    expect(ring[2].angle).toBeCloseTo(Math.PI, 6);
    expect(ring[3].angle).toBeCloseTo((3 * Math.PI) / 2, 6);
  });

  it('should place the only fireball at zero when the ring has one fireball', () => {
    const ring = createFireballRing(1, ORIGIN);

    expect(ring).toEqual([{ spin: 'CLOCKWISE', origin: ORIGIN, angle: 0 }]);
  });

  it('should create no fireballs when the ring has none', () => {
    const ring = createFireballRing(0, ORIGIN);

    expect(ring).toEqual([]);
  });
});
