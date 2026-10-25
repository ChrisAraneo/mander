import type { Rectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createPortalCoreStep } from './create-portal-core-step';
import { createPortalPulseStep } from './create-portal-pulse-step';
import { createPortalRingsStep } from './create-portal-rings-step';

const PORTAL: Rectangle = { x: 100, y: 20, width: 28, height: 44 };

describe('createPortalPulseStep', () => {
  it('should draw the core and then its rings inside a saved state when the pulse is at rest', () => {
    const calls = drawRecorded(createPortalPulseStep(PORTAL, 114, 42, 1, 0));

    expect(calls).toEqual([
      'save()',
      ...drawRecorded(createPortalCoreStep(PORTAL, 114, 42, 1)),
      ...drawRecorded(createPortalRingsStep(PORTAL, 114, 42, 1, 0)),
      'restore()',
    ]);
  });

  it('should hand the pulse and the clock on to the core and the rings when the portal swells', () => {
    const calls = drawRecorded(
      createPortalPulseStep(PORTAL, 114, 42, 1.05, 0.25),
    );

    expect(calls).toEqual([
      'save()',
      ...drawRecorded(createPortalCoreStep(PORTAL, 114, 42, 1.05)),
      ...drawRecorded(createPortalRingsStep(PORTAL, 114, 42, 1.05, 0.25)),
      'restore()',
    ]);
  });
});
