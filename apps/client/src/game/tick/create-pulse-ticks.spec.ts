import { lastValueFrom, of, toArray } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { createPulseTicks } from './create-pulse-ticks';

describe('createPulseTicks', () => {
  it('should tick once for each step in the pulses', async () => {
    const ticks = await lastValueFrom(
      createPulseTicks(
        of({ steps: 2, alpha: 0 }, { steps: 1, alpha: 0.5 }),
      ).pipe(toArray()),
    );

    expect(ticks).toEqual([
      { type: 'TICK' },
      { type: 'TICK' },
      { type: 'TICK' },
    ]);
  });

  it('should not tick when a pulse holds no step', async () => {
    const ticks = await lastValueFrom(
      createPulseTicks(of({ steps: 0, alpha: 0.5 })).pipe(toArray()),
    );

    expect(ticks).toEqual([]);
  });
});
