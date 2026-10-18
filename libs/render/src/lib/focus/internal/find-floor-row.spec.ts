import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../../test/create-render-test-level';
import { findFloorRow } from './find-floor-row';

describe('findFloorRow', () => {
  it('should find the first mostly solid row when the level has a floor', () => {
    const result = findFloorRow(
      createRenderTestLevel(['....', '.#..', '###.', '####']),
    );

    expect(result).toBe(2);
  });

  it('should settle halfway down when the level has no floor', () => {
    const result = findFloorRow(
      createRenderTestLevel(['....', '....', '....']),
    );

    expect(result).toBe(1.5);
  });
});
