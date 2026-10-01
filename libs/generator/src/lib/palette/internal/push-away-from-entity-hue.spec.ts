import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pushAwayFromEntityHue } from './push-away-from-entity-hue';

describe('pushAwayFromEntityHue', () => {
  it('should keep the hue when it sits far from the hue of the player and the enemies', () => {
    expect(map([120, 200, 300], pushAwayFromEntityHue)).toEqual([
      120, 200, 300,
    ]);
  });

  it('should keep the hue when it sits right on the guard', () => {
    expect(map([54, 354], pushAwayFromEntityHue)).toEqual([54, 354]);
  });

  it('should push the hue up past the guard when it sits just above the entity hue', () => {
    expect(map([24, 30, 53], pushAwayFromEntityHue)).toEqual([54, 54, 54]);
  });

  it('should push the hue down past the guard when it sits just below the entity hue', () => {
    expect(map([0, 10, 355], pushAwayFromEntityHue)).toEqual([354, 354, 354]);
  });
});
