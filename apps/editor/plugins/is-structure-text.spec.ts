import { describe, expect, it } from 'vitest';

import { isStructureText } from './is-structure-text.ts';

const FRONT = `  [
    [__, DR],
    [DR, DR],
  ]`;

const BACK = `  [
    [BR, BR],
    [__, __],
  ]`;

const sector = (front: string, back: string): string =>
  `[\n${front},\n${back},\n]`;

const EMPTY = '  []';

describe('isStructureText', () => {
  it('should accept the two layers the editor writes', () => {
    expect(isStructureText(sector(FRONT, BACK))).toBe(true);
  });

  it('should accept a sector with nothing painted behind it', () => {
    expect(isStructureText(sector(FRONT, EMPTY))).toBe(true);
  });

  it('should turn away rows of uneven length', () => {
    expect(
      isStructureText(sector('  [\n    [__, DR],\n    [DR],\n  ]', EMPTY)),
    ).toBe(false);
  });

  it('should turn away a sector that is missing a layer', () => {
    expect(isStructureText('[\n  [__, DR],\n  [DR, DR],\n]')).toBe(false);
    expect(isStructureText(`[\n${FRONT},\n]`)).toBe(false);
  });

  it('should turn away anything that is not a grid of tokens', () => {
    expect(isStructureText(sector('  [\n    [__, DR];\n  ]', EMPTY))).toBe(
      false,
    );
    expect(isStructureText('[]')).toBe(false);
    expect(isStructureText('')).toBe(false);
  });

  it('should turn away smuggled code', () => {
    expect(
      isStructureText(
        `${sector(FRONT, EMPTY)};\nprocess.exit(1);\nconst x = [\n  [DR],\n]`,
      ),
    ).toBe(false);
    expect(isStructureText(sector('  [\n    [__, DR()],\n  ]', EMPTY))).toBe(
      false,
    );
  });
});
