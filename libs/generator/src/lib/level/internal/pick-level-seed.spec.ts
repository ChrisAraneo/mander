import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { pickLevelSeed } from './pick-level-seed';

describe('pickLevelSeed', () => {
  it('should write the seed in capital letters and digits when it picks one', () => {
    expect(pickLevelSeed(createRandom('DAY-1'))).toMatch(/^[0-9A-Z]{14}$/);
  });

  it('should pick the same seed when the generator starts from the same seed', () => {
    expect(pickLevelSeed(createRandom('DAY-1'))).toBe(
      pickLevelSeed(createRandom('DAY-1')),
    );
  });

  it('should pick another seed when the generator starts from another seed', () => {
    expect(pickLevelSeed(createRandom('DAY-1'))).not.toBe(
      pickLevelSeed(createRandom('DAY-2')),
    );
  });

  it('should pick a new seed each time when it picks from one generator', () => {
    const random = createRandom('DAY-1');

    expect(pickLevelSeed(random)).not.toBe(pickLevelSeed(random));
  });
});
