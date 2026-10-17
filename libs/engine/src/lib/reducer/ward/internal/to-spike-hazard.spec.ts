import { describe, expect, it } from 'vitest';

import { toSpikeHazard } from './to-spike-hazard';

describe('toSpikeHazard', () => {
  it('should give the ceiling spike hazard when the spike hangs from the ceiling', () => {
    const hazard = toSpikeHazard('CEILING');

    expect(hazard).toBe('CEILING_SPIKE');
  });

  it('should give the floor spike hazard when the spike stands on the floor', () => {
    const hazard = toSpikeHazard('FLOOR');

    expect(hazard).toBe('FLOOR_SPIKE');
  });
});
