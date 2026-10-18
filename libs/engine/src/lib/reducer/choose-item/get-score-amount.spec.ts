import { type Item } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getScoreAmount } from './get-score-amount';

const createItem = (effect: Item['effect']): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'Stands in for a real chest item',
  rarity: 'COMMON',
  effect,
});

describe('getScoreAmount', () => {
  it('should give back the amount the effect carries when it scores', () => {
    expect(getScoreAmount(createItem({ kind: 'SCORE', amount: 1 }))).toBe(1);
    expect(getScoreAmount(createItem({ kind: 'SCORE', amount: 9000 }))).toBe(
      9000,
    );
  });

  it('should give back nothing when the item carries no effect at all', () => {
    expect(getScoreAmount(createItem({ kind: 'NONE' }))).toBe(0);
  });

  it('should give back nothing when the score effect is worth nothing', () => {
    expect(getScoreAmount(createItem({ kind: 'SCORE', amount: 0 }))).toBe(0);
  });

  it('should give back the amount as it stands when it runs negative', () => {
    expect(getScoreAmount(createItem({ kind: 'SCORE', amount: -100 }))).toBe(
      -100,
    );
  });
});
