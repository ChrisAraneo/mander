import { map, size, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from '../../../random/create-random';
import { createGermPair } from './create-germ-pair';

const TILE = { x: 3, y: 1 };

describe('createGermPair', () => {
  it('should hang two balls on the block when it pairs them up', () => {
    expect(size(createGermPair(TILE, createRandom('SEED')))).toBe(2);
  });

  it('should make both of them pink balls when it pairs them up', () => {
    expect(
      map(createGermPair(TILE, createRandom('SEED')), (germ) => germ.kind),
    ).toEqual(['PINK', 'PINK']);
  });

  it('should send one round each way when it pairs them up', () => {
    expect(
      size(
        uniq(
          map(createGermPair(TILE, createRandom('SEED')), (germ) => germ.spin),
        ),
      ),
    ).toBe(2);
  });

  it('should hang both of them on the same block when it pairs them up', () => {
    const [germ, twin] = createGermPair(TILE, createRandom('SEED'));

    expect(twin.origin).toEqual(germ.origin);
  });

  it('should set them off on opposite sides when it pairs them up', () => {
    const [germ, twin] = createGermPair(TILE, createRandom('SEED'));

    expect(twin.angle).not.toBeCloseTo(germ.angle, 6);
  });
});
