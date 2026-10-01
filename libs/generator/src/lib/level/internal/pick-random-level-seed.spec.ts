import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { pickRandomLevelSeed } from './pick-random-level-seed';

describe('pickRandomLevelSeed', () => {
  it('should write the seed in capital letters and digits when it picks one', () => {
    expect(pickRandomLevelSeed(createRandom('DAY-1'))).toMatch(
      /^[0-9A-Z]{14}$/,
    );
  });

  it('should pick the same seed when the generator starts from the same seed', () => {
    expect(pickRandomLevelSeed(createRandom('DAY-1'))).toBe(
      pickRandomLevelSeed(createRandom('DAY-1')),
    );
  });

  it('should pick another seed when the generator starts from another seed', () => {
    expect(pickRandomLevelSeed(createRandom('DAY-1'))).not.toBe(
      pickRandomLevelSeed(createRandom('DAY-2')),
    );
  });

  it('should pick a new seed each time when it picks from one generator', () => {
    const random = createRandom('DAY-1');

    expect(pickRandomLevelSeed(random)).not.toBe(pickRandomLevelSeed(random));
  });
});
