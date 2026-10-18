import { type Item, MOON_MAGNET } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { hasMoonMagnet } from './has-moon-magnet';

const createTrinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

describe('hasMoonMagnet', () => {
  it('should find the magnet when the player carries it among other items', () => {
    const isOwned = hasMoonMagnet([createTrinket('GEM'), MOON_MAGNET]);

    expect(isOwned).toBe(true);
  });

  it('should find the magnet by its id when the item looks different', () => {
    const isOwned = hasMoonMagnet([createTrinket(MOON_MAGNET.id)]);

    expect(isOwned).toBe(true);
  });

  it('should not find the magnet when the player carries only other items', () => {
    const isOwned = hasMoonMagnet([createTrinket('GEM')]);

    expect(isOwned).toBe(false);
  });

  it('should not find the magnet when the player carries nothing', () => {
    const isOwned = hasMoonMagnet([]);

    expect(isOwned).toBe(false);
  });
});
