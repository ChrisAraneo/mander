import { type Item, STAR, TWO_BULLETS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getBulletsAmount } from './get-bullets-amount';

const createItem = (effect: Item['effect']): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'Stands in for a real chest item',
  rarity: 'COMMON',
  effect,
});

describe('getBulletsAmount', () => {
  it('should give the number of rounds when the item holds bullets', () => {
    const amount = getBulletsAmount(TWO_BULLETS);

    expect(amount).toBe(4);
  });

  it('should give the number of rounds as it stands when the item holds an odd amount', () => {
    const amount = getBulletsAmount(createItem({ kind: 'BULLET', amount: 7 }));

    expect(amount).toBe(7);
  });

  it('should give nothing when the item is a star', () => {
    const amount = getBulletsAmount(STAR);

    expect(amount).toBe(0);
  });

  it('should give nothing when the item carries no effect at all', () => {
    const amount = getBulletsAmount(createItem({ kind: 'NONE' }));

    expect(amount).toBe(0);
  });
});
