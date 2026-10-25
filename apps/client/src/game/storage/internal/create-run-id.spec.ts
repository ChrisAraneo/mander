import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRunId } from './create-run-id';

describe('createRunId', () => {
  it('should join the world, the moment and a random suffix when it creates an id', () => {
    expect(createRunId('ABC', '2026-09-04T10:00:00Z', constant(0.5))).toBe(
      `ABC:2026-09-04T10:00:00Z:${(5e7).toString(36)}`,
    );
  });

  it('should give the same id when the same random draw is used', () => {
    expect(createRunId('ABC', 'NOW', constant(0.25))).toBe(
      createRunId('ABC', 'NOW', constant(0.25)),
    );
  });

  it('should tell two runs apart when they end in the same instant with other draws', () => {
    expect(createRunId('ABC', 'NOW', constant(0.1))).not.toBe(
      createRunId('ABC', 'NOW', constant(0.2)),
    );
  });
});
