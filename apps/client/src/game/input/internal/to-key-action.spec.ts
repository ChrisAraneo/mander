import { describe, expect, it } from 'vitest';

import type { KeyBinding } from '../types/key-binding';
import { toKeyAction } from './to-key-action';

const HELD: KeyBinding = {
  code: 'KeyA',
  start: { type: 'MOVE_LEFT_START' },
  stop: { type: 'MOVE_LEFT_STOP' },
};

const PRESSED: KeyBinding = { code: 'KeyE', start: { type: 'INTERACT' } };

describe('toKeyAction', () => {
  it('should start the move when the key goes down', () => {
    expect(toKeyAction(HELD, 'keydown', false)).toBe(HELD.start);
  });

  it('should give nothing when the key goes down again by repeating', () => {
    expect(toKeyAction(HELD, 'keydown', true)).toBeUndefined();
  });

  it('should stop the move when the key comes up', () => {
    expect(toKeyAction(HELD, 'keyup', false)).toBe(HELD.stop);
  });

  it('should give nothing when a key with no stop comes up', () => {
    expect(toKeyAction(PRESSED, 'keyup', false)).toBeUndefined();
  });
});
