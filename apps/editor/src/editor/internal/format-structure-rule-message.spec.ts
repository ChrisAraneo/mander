import {
  STRUCTURE_HEIGHT,
  STRUCTURE_WIDTH,
  VERTICAL_HEIGHT,
} from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { formatStructureRuleMessage } from './format-structure-rule-message';

describe('formatStructureRuleMessage', () => {
  it('should name the size of the pool when the rule is the size', () => {
    expect(formatStructureRuleMessage('SIZE', 'normal')).toBe(
      `both layers must be ${STRUCTURE_WIDTH} × ${STRUCTURE_HEIGHT} cells`,
    );
    expect(formatStructureRuleMessage('SIZE', 'vertical')).toBe(
      `both layers must be ${STRUCTURE_WIDTH} × ${VERTICAL_HEIGHT} cells`,
    );
  });

  it('should ask for known tiles when the rule is the known tiles', () => {
    expect(formatStructureRuleMessage('KNOWN_TILES', 'normal')).toBe(
      'every cell must be a tile the game knows, a start (98) or an end (99)',
    );
  });

  it('should ask for blocks alone behind the level when the rule is the back layer', () => {
    expect(formatStructureRuleMessage('BACK_LAYER', 'normal')).toBe(
      'the back layer takes blocks alone — a hazard or a marker has nothing to do behind the level',
    );
  });

  it('should ask for one start when the rule is the start', () => {
    expect(formatStructureRuleMessage('ONE_START', 'hard')).toBe(
      'mark where the player enters with exactly one start (98)',
    );
  });

  it('should ask for one end when the rule is the end', () => {
    expect(formatStructureRuleMessage('ONE_END', 'hard')).toBe(
      'mark where the player leaves with exactly one end (99)',
    );
  });

  it('should ask for anchors when the rule is the anchored hazards', () => {
    expect(formatStructureRuleMessage('ANCHORED_HAZARDS', 'vertical')).toBe(
      'a spike or beartrap needs a block below it, a ceiling or falling spike one above — a background block is not something to stand on',
    );
  });
});
