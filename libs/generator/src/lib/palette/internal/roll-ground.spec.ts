import { createRandom, wrapHue } from '@mander/utils';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { rollGround } from './roll-ground';

const ENTITY_HUE = 24;

const GROUNDS = times(200, (day) => rollGround(createRandom(`WORLD-${day}`)));

describe('rollGround', () => {
  it('should roll the same ground when the generator starts from the same seed', () => {
    expect(rollGround(createRandom('WORLD-1'))).toEqual(
      rollGround(createRandom('WORLD-1')),
    );
  });

  it('should roll other grounds when the seeds differ', () => {
    expect(size(uniq(map(GROUNDS, 'hue')))).toBeGreaterThan(1);
  });

  it('should keep the ground between its lowest and highest shades when it rolls many grounds', () => {
    expect(
      every(
        GROUNDS,
        ({ saturation, lightness }) =>
          saturation >= 18 &&
          saturation <= 30 &&
          lightness >= 28 &&
          lightness <= 36,
      ),
    ).toBe(true);
  });

  it('should keep the cap between its lowest and highest shades when it rolls many grounds', () => {
    expect(
      every(
        GROUNDS,
        ({ capSaturation, capLightness }) =>
          capSaturation >= 34 &&
          capSaturation <= 50 &&
          capLightness >= 44 &&
          capLightness <= 54,
      ),
    ).toBe(true);
  });

  it('should keep the cap hue away from the hue of the player and the enemies when it rolls many grounds', () => {
    expect(
      every(GROUNDS, ({ capHue }) => {
        const gap = wrapHue(capHue - ENTITY_HUE);

        return gap >= 30 && gap <= 330;
      }),
    ).toBe(true);
  });
});
