import type { Item } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getHeartsAmount } from './get-hearts-amount';

const createItem = (effect: Item['effect']): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'Stands in for a real chest item',
  rarity: 'COMMON',
  effect,
});

describe('getHeartsAmount', () => {
  it('should give back the amount the effect carries when it heals', () => {
    expect(getHeartsAmount(createItem({ kind: 'HEART', amount: 5 }))).toBe(5);
  });

  it('should give back nothing when the item carries no effect at all', () => {
    expect(getHeartsAmount(createItem({ kind: 'NONE' }))).toBe(0);
  });

  it('should give back nothing when the heart effect is worth nothing', () => {
    expect(getHeartsAmount(createItem({ kind: 'HEART', amount: 0 }))).toBe(0);
  });

  it('should give back the amount as it stands when it runs negative', () => {
    expect(getHeartsAmount(createItem({ kind: 'HEART', amount: -1 }))).toBe(-1);
  });

  it('should give back nothing when the item scores', () => {
    expect(getHeartsAmount(createItem({ kind: 'SCORE', amount: 50 }))).toBe(0);
  });

  it('should give back nothing when the item is a star', () => {
    expect(getHeartsAmount(createItem({ kind: 'STAR', amount: 2 }))).toBe(0);
  });

  it('should give back nothing when the item holds bullets', () => {
    expect(getHeartsAmount(createItem({ kind: 'BULLET', amount: 2 }))).toBe(0);
  });
});
