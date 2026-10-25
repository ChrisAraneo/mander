import { getWorldMeta, type World } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { DEBUG_PARAM, WORLD_META_LABEL } from './consts';
import { logWorldMeta } from './log-world-meta';

const WORLD: World = { name: 'ABC', levels: [], score: 0 };

describe('logWorldMeta', () => {
  it('should write the world summary when the address asks for debugging', () => {
    const lines: unknown[] = [];

    logWorldMeta(WORLD, `?${DEBUG_PARAM}`, (...line) => lines.push(line));

    expect(lines).toEqual([[WORLD_META_LABEL, getWorldMeta(WORLD)]]);
  });

  it('should write nothing when the address does not ask for debugging', () => {
    const lines: unknown[] = [];

    logWorldMeta(WORLD, '', (...line) => lines.push(line));

    expect(lines).toEqual([]);
  });
});
