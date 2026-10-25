import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { parseOutcome } from './parse-outcome';

describe('parseOutcome', () => {
  it('should keep each outcome when it is one the game knows', () => {
    expect(
      map(['COMPLETE', 'GAME_OVER', 'ABANDONED'], (outcome) =>
        parseOutcome(outcome),
      ),
    ).toEqual(['COMPLETE', 'GAME_OVER', 'ABANDONED']);
  });

  it('should take the run as left unfinished when the outcome is unknown', () => {
    expect(parseOutcome('LOST')).toBe('ABANDONED');
  });

  it('should take the run as left unfinished when there is no outcome', () => {
    expect(parseOutcome(undefined)).toBe('ABANDONED');
  });
});
