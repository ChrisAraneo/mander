import { createRandom } from '@mander/utils';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { EPIC_POOL } from '../../consts';
import { dealEpics } from './deal-epics';

describe('dealEpics', () => {
  it('should deal as many epics as were rolled when the pool holds enough', () => {
    expect(size(dealEpics(2, createRandom('DAY-1')))).toBe(2);
  });

  it('should deal only epic cards when it deals epics', () => {
    expect(every(dealEpics(3, createRandom('DAY-1')), { rarity: 'EPIC' })).toBe(
      true,
    );
  });

  it('should never deal the same epic twice when it deals several', () => {
    const cards = dealEpics(size(EPIC_POOL), createRandom('DAY-1'));

    expect(size(uniq(map(cards, 'id')))).toBe(size(cards));
  });

  it('should deal no more epics than the pool holds when more were rolled', () => {
    expect(size(dealEpics(size(EPIC_POOL) + 3, createRandom('DAY-1')))).toBe(
      size(EPIC_POOL),
    );
  });

  it('should deal the same epics when the generator starts from the same seed', () => {
    expect(dealEpics(2, createRandom('DAY-1'))).toEqual(
      dealEpics(2, createRandom('DAY-1')),
    );
  });

  it('should deal other epics when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          times(
            30,
            (index) => dealEpics(1, createRandom(`DAY-${index}`))[0].id,
          ),
        ),
      ),
    ).toBeGreaterThan(1);
  });

  it('should deal nothing when no epic was rolled', () => {
    expect(dealEpics(0, createRandom('DAY-1'))).toEqual([]);
  });
});
