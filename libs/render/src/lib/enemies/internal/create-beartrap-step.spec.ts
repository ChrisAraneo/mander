import { describe, expect, it } from 'vitest';

import { hashRecorded } from '../../../test/hash-recorded';
import { createBeartrapStep } from './create-beartrap-step';

describe('createBeartrapStep', () => {
  it('should draw the plate, the pan, the open jaws and the springs when the trap is set', () => {
    const fingerprint = hashRecorded(createBeartrapStep(false));

    expect(fingerprint).toBe('101:08IHHCB0BO8E62');
  });

  it('should draw the jaws shut when the trap has snapped', () => {
    const fingerprint = hashRecorded(createBeartrapStep(true));

    expect(fingerprint).toBe('101:1W6SG4J1P6VFLD');
  });
});
