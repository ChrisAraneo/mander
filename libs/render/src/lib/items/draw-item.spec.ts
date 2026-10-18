import {
  BULLET,
  DOUBLE_HEART,
  DOUBLE_STAR,
  FOUR_BULLETS,
  HEART,
  type Item,
  type ItemEffect,
  PURPLE_GEM,
  RED_GEM,
  STAR,
  TRIPLE_HEART,
  TRIPLE_STAR,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { hashRecorded } from '../../test/hash-recorded';
import { drawItem } from './draw-item';

const SIZE = 64;

const createEffectItem = (effect: ItemEffect): Item => ({
  id: 'TEST_ITEM',
  name: 'Test item',
  description: 'An item that exists only in this spec',
  rarity: 'COMMON',
  effect,
});

const hashDrawnItem = (item: Item, size: number): string =>
  hashRecorded((context) => drawItem(context, item, size));

describe('drawItem', () => {
  it('should draw one big heart when the item is the heart', () => {
    expect(hashDrawnItem(HEART, SIZE)).toBe('17:1S9J95V1DTTSRN');
  });

  it('should draw the heart smaller when the item art is drawn at half size', () => {
    expect(hashDrawnItem(HEART, 32)).toBe('17:15O59V31PLK6TL');
  });

  it('should draw two hearts when the item is the double heart', () => {
    expect(hashDrawnItem(DOUBLE_HEART, SIZE)).toBe('34:11FF79T0ZSAJEM');
  });

  it('should draw three hearts when the item is the triple heart', () => {
    expect(hashDrawnItem(TRIPLE_HEART, SIZE)).toBe('51:0XS81AZ155LDTE');
  });

  it('should draw no more than three hearts when the effect gives more', () => {
    expect(
      hashDrawnItem(createEffectItem({ kind: 'HEART', amount: 7 }), SIZE),
    ).toBe('51:0XS81AZ155LDTE');
  });

  it('should draw one star when the item is the star', () => {
    expect(hashDrawnItem(STAR, SIZE)).toBe('24:0YTHAIQ1TRWYHS');
  });

  it('should draw two stars when the item is the double star', () => {
    expect(hashDrawnItem(DOUBLE_STAR, SIZE)).toBe('48:0OTP26C1RUQHT8');
  });

  it('should draw three stars when the item is the triple star', () => {
    expect(hashDrawnItem(TRIPLE_STAR, SIZE)).toBe('72:0AVEF8B1VET5Z6');
  });

  it('should draw a red gem when the item is the red gem', () => {
    expect(hashDrawnItem(RED_GEM, SIZE)).toBe('24:10D886K10ZKXDV');
  });

  it('should draw a purple gem when the item is the purple gem', () => {
    expect(hashDrawnItem(PURPLE_GEM, SIZE)).toBe('24:1V6K8QC0BX4LA6');
  });

  it('should draw two bullets when the item gives two bullets', () => {
    expect(hashDrawnItem(BULLET, SIZE)).toBe('34:1JFQOS11BVL3XS');
  });

  it('should draw four bullets when the effect gives five bullets', () => {
    expect(
      hashDrawnItem(createEffectItem({ kind: 'BULLET', amount: 5 }), SIZE),
    ).toBe('68:1Y1AEKR1T8472L');
  });

  it('should draw eight bullets when the item gives eight bullets', () => {
    expect(hashDrawnItem(FOUR_BULLETS, SIZE)).toBe('136:19UPO481XV0BYU');
  });

  it('should draw a single bullet when the effect gives no bullets', () => {
    expect(
      hashDrawnItem(createEffectItem({ kind: 'BULLET', amount: 0 }), SIZE),
    ).toBe('17:0G4V1RS1PPUP48');
  });

  it('should draw a red gem when an unlisted item only gives score', () => {
    expect(
      hashDrawnItem(createEffectItem({ kind: 'SCORE', amount: 10 }), SIZE),
    ).toBe('24:10D886K10ZKXDV');
  });
});
