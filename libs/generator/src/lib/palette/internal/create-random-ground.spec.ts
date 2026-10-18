import { createRandom } from '@mander/engine';
import { chain } from '@mander/model';
import { wrapHue } from '@mander/render';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { ENTITY_HUE } from '../../consts';
import { createRandomGround } from './create-random-ground';

const GROUNDS = times(200, (day) =>
  createRandomGround(createRandom(`WORLD-${day}`)),
);

describe('createRandomGround', () => {
  it('should pick the same ground when the generator starts from the same seed', () => {
    expect(createRandomGround(createRandom('WORLD-1'))).toEqual(
      createRandomGround(createRandom('WORLD-1')),
    );
  });

  it('should pick other grounds when the seeds differ', () => {
    expect(size(uniq(map(GROUNDS, 'hue')))).toBeGreaterThan(1);
  });

  it('should keep the ground between its lowest and highest shades when it picks many grounds', () => {
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

  it('should keep the cap between its lowest and highest shades when it picks many grounds', () => {
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

  it('should keep the cap hue away from the hue of the player and the enemies when it picks many grounds', () => {
    expect(
      every(GROUNDS, ({ capHue }) =>
        chain(wrapHue(capHue - ENTITY_HUE))
          .thru((gap) => gap >= 30 && gap <= 330)
          .value(),
      ),
    ).toBe(true);
  });
});
