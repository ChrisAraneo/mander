import { describe, expect, it } from 'vitest';

import { getBeartrapJawTilt } from './get-beartrap-jaw-tilt';

describe('getBeartrapJawTilt', () => {
  it('should tilt the jaws slightly inwards when the trap has snapped', () => {
    const result = getBeartrapJawTilt(true);

    expect(result).toBe(0.12);
  });

  it('should tilt the jaws wide open when the trap is set', () => {
    const result = getBeartrapJawTilt(false);

    expect(result).toBe(-0.65);
  });
});
