import {
  getStructureName,
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
} from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { createLevelMeta } from './create-level-meta';

describe('createLevelMeta', () => {
  it('should name every structure in order when it records them', () => {
    expect(createLevelMeta([NORMAL_STRUCTURES[1], HARD_STRUCTURES[0]])).toEqual(
      {
        structures: [
          getStructureName(NORMAL_STRUCTURES[1]),
          getStructureName(HARD_STRUCTURES[0]),
        ],
      },
    );
  });

  it('should record no structures when there are none', () => {
    expect(createLevelMeta([])).toEqual({ structures: [] });
  });
});
