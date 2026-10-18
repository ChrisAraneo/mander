import type { Item, ItemEffect } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { RED_GEM_COLORS } from '../../gem-shape/consts';
import { GOLD_STAR } from '../../star/consts';
import { toEffectItemArt } from './to-effect-item-art';

const createEffectItem = (effect: ItemEffect): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'An item that exists only in this spec',
  rarity: 'COMMON',
  effect,
});

describe('toEffectItemArt', () => {
  it('should show hearts when the effect gives hearts', () => {
    const result = toEffectItemArt(
      createEffectItem({ kind: 'HEART', amount: 2 }),
    );

    expect(result).toEqual({ kind: 'HEARTS', count: 2 });
  });

  it('should show stars when the effect gives stars', () => {
    const result = toEffectItemArt(
      createEffectItem({ kind: 'STAR', amount: 1 }),
    );

    expect(result).toEqual({ kind: 'STARS', count: 1, colors: GOLD_STAR });
  });

  it('should show bullets when the effect gives bullets', () => {
    const result = toEffectItemArt(
      createEffectItem({ kind: 'BULLET', amount: 6 }),
    );

    expect(result).toEqual({ kind: 'BULLETS', count: 6 });
  });

  it('should show a red gem when the effect only gives score', () => {
    const result = toEffectItemArt(
      createEffectItem({ kind: 'SCORE', amount: 100 }),
    );

    expect(result).toEqual({ kind: 'GEM', colors: RED_GEM_COLORS });
  });

  it('should show a red gem when the item has no effect', () => {
    const result = toEffectItemArt(createEffectItem({ kind: 'NONE' }));

    expect(result).toEqual({ kind: 'GEM', colors: RED_GEM_COLORS });
  });
});
