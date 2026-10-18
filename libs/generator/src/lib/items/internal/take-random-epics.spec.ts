import { createRandom } from '@mander/engine';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { EPIC_POOL } from '../../consts';
import { takeRandomEpics } from './take-random-epics';

describe('takeRandomEpics', () => {
  it('should pick as many epics as were rolled when the pool holds enough', () => {
    expect(size(takeRandomEpics(2, createRandom('DAY-1')))).toBe(2);
  });

  it('should pick only epic cards when it picks epics', () => {
    expect(
      every(takeRandomEpics(3, createRandom('DAY-1')), { rarity: 'EPIC' }),
    ).toBe(true);
  });

  it('should never pick the same epic twice when it picks several', () => {
    const cards = takeRandomEpics(size(EPIC_POOL), createRandom('DAY-1'));

    expect(size(uniq(map(cards, 'id')))).toBe(size(cards));
  });

  it('should pick no more epics than the pool holds when more were rolled', () => {
    expect(
      size(takeRandomEpics(size(EPIC_POOL) + 3, createRandom('DAY-1'))),
    ).toBe(size(EPIC_POOL));
  });

  it('should pick the same epics when the generator starts from the same seed', () => {
    expect(takeRandomEpics(2, createRandom('DAY-1'))).toEqual(
      takeRandomEpics(2, createRandom('DAY-1')),
    );
  });

  it('should pick other epics when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(
            30,
            (index) => takeRandomEpics(1, createRandom(`DAY-${index}`))[0].id,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should pick nothing when no epic was rolled', () => {
    expect(takeRandomEpics(0, createRandom('DAY-1'))).toEqual([]);
  });
});
