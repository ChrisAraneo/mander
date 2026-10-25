import { describe, expect, it } from 'vitest';

import { nextReplaySpeed } from './next-replay-speed';

describe('nextReplaySpeed', () => {
  it('should go one speed faster when it is not at the fastest yet', () => {
    expect(nextReplaySpeed(1)).toBe(2);
    expect(nextReplaySpeed(2)).toBe(4);
  });

  it('should go back to the normal speed when it is at the fastest', () => {
    expect(nextReplaySpeed(4)).toBe(1);
  });

  it('should go to the normal speed when the speed is not one it knows', () => {
    expect(nextReplaySpeed(3)).toBe(1);
  });
});
