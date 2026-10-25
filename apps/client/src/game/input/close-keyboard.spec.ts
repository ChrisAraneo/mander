import { describe, expect, it } from 'vitest';

import { closeKeyboard } from './close-keyboard';
import { createKeyboard } from './create-keyboard';

describe('closeKeyboard', () => {
  it('should stop listening to the keys when it closes the keyboard', () => {
    const keyboard = createKeyboard(new EventTarget());

    closeKeyboard(keyboard);

    expect(keyboard.subscription.closed).toBe(true);
  });

  it('should end the stream of actions when it closes the keyboard', () => {
    const ended: boolean[] = [];
    const keyboard = createKeyboard(new EventTarget());
    keyboard.actions.subscribe({ complete: () => ended.push(true) });

    closeKeyboard(keyboard);

    expect(ended).toEqual([true]);
  });
});
