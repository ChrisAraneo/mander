import {
  BLUE_GEM,
  BOOTS_OF_CLOUDS,
  BULLET,
  DOUBLE_HEART,
  DOUBLE_STAR,
  GREEN_GEM,
  HEART,
  type Item,
  type ItemEffect,
  MOON_MAGNET,
  PINK_GEM,
  PURPLE_GEM,
  RED_GEM,
  STAR,
  TITANIUM_HELMET,
  TRIPLE_HEART,
  TRIPLE_STAR,
  VAMPIRE_SLAYER_BULLET_RAIN,
  YELLOW_GEM,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  BLUE_GEM_COLORS,
  GREEN_GEM_COLORS,
  PINK_GEM_COLORS,
  PURPLE_GEM_COLORS,
  RED_GEM_COLORS,
  YELLOW_GEM_COLORS,
} from '../gem-shape/consts';
import { GOLD_STAR } from '../star/consts';
import { getItemArt } from './get-item-art';

const createEffectItem = (effect: ItemEffect): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'An item that exists only in this spec',
  rarity: 'COMMON',
  effect,
});

describe('getItemArt', () => {
  it('should show one heart when the item is the heart', () => {
    expect(getItemArt(HEART)).toEqual({ kind: 'HEARTS', count: 1 });
  });

  it('should show two hearts when the item is the double heart', () => {
    expect(getItemArt(DOUBLE_HEART)).toEqual({ kind: 'HEARTS', count: 2 });
  });

  it('should show three hearts when the item is the triple heart', () => {
    expect(getItemArt(TRIPLE_HEART)).toEqual({ kind: 'HEARTS', count: 3 });
  });

  it('should show one gold star when the item is the star', () => {
    expect(getItemArt(STAR)).toEqual({
      kind: 'STARS',
      count: 1,
      colors: GOLD_STAR,
    });
  });

  it('should show two gold stars when the item is the double star', () => {
    expect(getItemArt(DOUBLE_STAR)).toEqual({
      kind: 'STARS',
      count: 2,
      colors: GOLD_STAR,
    });
  });

  it('should show as many gold stars as the effect gives when the item has no picture of its own', () => {
    expect(getItemArt(TRIPLE_STAR)).toEqual({
      kind: 'STARS',
      count: 3,
      colors: GOLD_STAR,
    });
  });

  it('should show each gem in its own colours when the item is a gem', () => {
    expect(getItemArt(RED_GEM)).toEqual({
      kind: 'GEM',
      colors: RED_GEM_COLORS,
    });
    expect(getItemArt(GREEN_GEM)).toEqual({
      kind: 'GEM',
      colors: GREEN_GEM_COLORS,
    });
    expect(getItemArt(YELLOW_GEM)).toEqual({
      kind: 'GEM',
      colors: YELLOW_GEM_COLORS,
    });
    expect(getItemArt(BLUE_GEM)).toEqual({
      kind: 'GEM',
      colors: BLUE_GEM_COLORS,
    });
    expect(getItemArt(PURPLE_GEM)).toEqual({
      kind: 'GEM',
      colors: PURPLE_GEM_COLORS,
    });
    expect(getItemArt(PINK_GEM)).toEqual({
      kind: 'GEM',
      colors: PINK_GEM_COLORS,
    });
  });

  it('should show the boots when the item is the boots of clouds', () => {
    expect(getItemArt(BOOTS_OF_CLOUDS)).toEqual({ kind: 'BOOTS' });
  });

  it('should show the helmet when the item is the titanium helmet', () => {
    expect(getItemArt(TITANIUM_HELMET)).toEqual({ kind: 'HELMET' });
  });

  it('should show as many bullets as the effect gives when the item gives bullets', () => {
    expect(getItemArt(BULLET)).toEqual({ kind: 'BULLETS', count: 2 });
    expect(getItemArt(VAMPIRE_SLAYER_BULLET_RAIN)).toEqual({
      kind: 'BULLETS',
      count: 9999,
    });
  });

  it('should show as many fireballs as the effect gives when the item gives fireballs', () => {
    expect(getItemArt(MOON_MAGNET)).toEqual({ kind: 'FIREBALLS', count: 2 });
  });

  it('should show as many hearts as the effect gives when an unlisted item gives hearts', () => {
    expect(getItemArt(createEffectItem({ kind: 'HEART', amount: 5 }))).toEqual({
      kind: 'HEARTS',
      count: 5,
    });
  });

  it('should show the boots when an unlisted item wards off floor spikes', () => {
    expect(
      getItemArt(createEffectItem({ kind: 'WARD', hazard: 'FLOOR_SPIKE' })),
    ).toEqual({ kind: 'BOOTS' });
  });

  it('should show the helmet when an unlisted item wards off ceiling spikes', () => {
    expect(
      getItemArt(createEffectItem({ kind: 'WARD', hazard: 'CEILING_SPIKE' })),
    ).toEqual({ kind: 'HELMET' });
  });

  it('should show a red gem when an unlisted item only gives score', () => {
    expect(
      getItemArt(createEffectItem({ kind: 'SCORE', amount: 100 })),
    ).toEqual({ kind: 'GEM', colors: RED_GEM_COLORS });
  });

  it('should show a red gem when an unlisted item has no effect', () => {
    expect(getItemArt(createEffectItem({ kind: 'NONE' }))).toEqual({
      kind: 'GEM',
      colors: RED_GEM_COLORS,
    });
  });
});
