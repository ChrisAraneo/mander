import { createRandom } from '@mander/utils';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickRandomSky } from './pick-random-sky';

const SKIES = times(200, (day) => pickRandomSky(createRandom(`WORLD-${day}`)));

describe('pickRandomSky', () => {
  it('should pick the same sky when the generator starts from the same seed', () => {
    expect(pickRandomSky(createRandom('WORLD-1'))).toEqual(
      pickRandomSky(createRandom('WORLD-1')),
    );
  });

  it('should pick other skies when the seeds differ', () => {
    expect(size(uniq(map(SKIES, 'hue')))).toBeGreaterThan(1);
  });

  it('should keep the saturation between 24 and 38 when it picks many skies', () => {
    expect(
      every(SKIES, ({ saturation }) => saturation >= 24 && saturation <= 38),
    ).toBe(true);
  });

  it('should keep the glow saturation between 44 and 60 when it picks many skies', () => {
    expect(
      every(
        SKIES,
        ({ glowSaturation }) => glowSaturation >= 44 && glowSaturation <= 60,
      ),
    ).toBe(true);
  });

  it('should keep the top lightness between 26 and 34 when it picks many skies', () => {
    expect(
      every(
        SKIES,
        ({ topLightness }) => topLightness >= 26 && topLightness <= 34,
      ),
    ).toBe(true);
  });
});
