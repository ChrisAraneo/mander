import { type Item, STAR, TWO_BULLETS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getStarsAmount } from './get-stars-amount';

const createItem = (effect: Item['effect']): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'Stands in for a real chest item',
  rarity: 'COMMON',
  effect,
});

describe('getStarsAmount', () => {
  it('should give the number of stars when the item is a star', () => {
    const amount = getStarsAmount(STAR);

    expect(amount).toBe(1);
  });

  it('should give the number of stars as it stands when the item holds several', () => {
    const amount = getStarsAmount(createItem({ kind: 'STAR', amount: 3 }));

    expect(amount).toBe(3);
  });

  it('should give nothing when the item holds bullets', () => {
    const amount = getStarsAmount(TWO_BULLETS);

    expect(amount).toBe(0);
  });

  it('should give nothing when the item carries no effect at all', () => {
    const amount = getStarsAmount(createItem({ kind: 'NONE' }));

    expect(amount).toBe(0);
  });
});
