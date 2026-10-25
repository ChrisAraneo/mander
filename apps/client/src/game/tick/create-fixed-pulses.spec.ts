import { FIXED_STEP_MS } from '@mander/model';
import { map } from 'lodash-es';
import { lastValueFrom, of, toArray } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { createFixedPulses } from './create-fixed-pulses';
import type { Pulse } from './types/pulse';

const runFixedPulses = (timestamps: number[]): Promise<Pulse[]> =>
  lastValueFrom(
    createFixedPulses(
      of(...map(timestamps, (timestamp) => ({ timestamp }))),
    ).pipe(toArray()),
  );

describe('createFixedPulses', () => {
  it('should give one pulse for each frame after the first', async () => {
    expect(await runFixedPulses([0, 10, 20, 30])).toHaveLength(3);
  });

  it('should count the whole steps that fit in the time between frames', async () => {
    const [pulse] = await runFixedPulses([0, FIXED_STEP_MS * 2]);

    expect(pulse.steps).toBe(2);
  });

  it('should carry the part of a step left over into the next frame', async () => {
    const pulses = await runFixedPulses([
      0,
      FIXED_STEP_MS * 0.5,
      FIXED_STEP_MS,
    ]);

    expect(map(pulses, (pulse) => pulse.steps)).toEqual([0, 1]);
  });

  it('should say how far into the next step the frame lands', async () => {
    const [pulse] = await runFixedPulses([0, FIXED_STEP_MS * 1.25]);

    expect(pulse.alpha).toBeCloseTo(0.25);
  });

  it('should give no pulse when there is only one frame', async () => {
    expect(await runFixedPulses([0])).toEqual([]);
  });
});
