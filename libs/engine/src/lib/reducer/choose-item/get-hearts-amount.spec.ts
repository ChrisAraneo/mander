import { type Item } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getHeartsAmount } from './get-hearts-amount';

const itemWith = (effect: Item['effect']): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'Stands in for a real chest item',
  rarity: 'COMMON',
  effect,
});

describe('getHeartsAmount', () => {
  it('should give back the amount the effect carries when it heals', () => {
    expect(getHeartsAmount(itemWith({ kind: 'HEART', amount: 5 }))).toBe(5);
  });

  it('should give back nothing when the item carries no effect at all', () => {
    expect(getHeartsAmount(itemWith({ kind: 'NONE' }))).toBe(0);
  });

  it('should give back nothing when the heart effect is worth nothing', () => {
    expect(getHeartsAmount(itemWith({ kind: 'HEART', amount: 0 }))).toBe(0);
  });

  it('should give back the amount as it stands when it runs negative', () => {
    expect(getHeartsAmount(itemWith({ kind: 'HEART', amount: -1 }))).toBe(-1);
  });
});
