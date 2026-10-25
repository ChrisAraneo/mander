import type { Action } from '@mander/engine';
import { assign, tap } from 'lodash-es';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { watchKeyboard } from './watch-keyboard';

const createKeyEvent = (type: string, code: string): Event =>
  assign(new Event(type, { cancelable: true }), { code, repeat: false });

const watchActions = (actions: Subject<Action>): Action[] =>
  tap(new Array<Action>(), (received) =>
    actions.subscribe((action) => received.push(action)),
  );

describe('watchKeyboard', () => {
  it('should send the actions of the keys pressed on the page when it watches it', () => {
    const target = new EventTarget();
    const actions = new Subject<Action>();
    const received = watchActions(actions);
    const keyboard = watchKeyboard(target, actions);

    target.dispatchEvent(createKeyEvent('keydown', 'KeyD'));
    target.dispatchEvent(createKeyEvent('keyup', 'KeyD'));

    expect(received).toEqual([
      { type: 'MOVE_RIGHT_START' },
      { type: 'MOVE_RIGHT_STOP' },
    ]);
    keyboard.subscription.unsubscribe();
  });

  it('should hand back the actions it was given when it watches the page', () => {
    const actions = new Subject<Action>();

    const keyboard = watchKeyboard(new EventTarget(), actions);

    expect(keyboard.actions).toBe(actions);
    keyboard.subscription.unsubscribe();
  });

  it('should send nothing when no key is pressed', () => {
    const actions = new Subject<Action>();
    const received = watchActions(actions);

    const keyboard = watchKeyboard(new EventTarget(), actions);

    expect(received).toEqual([]);
    keyboard.subscription.unsubscribe();
  });

  it('should send nothing when the keys are pressed after it stops watching', () => {
    const target = new EventTarget();
    const actions = new Subject<Action>();
    const received = watchActions(actions);
    const keyboard = watchKeyboard(target, actions);
    keyboard.subscription.unsubscribe();

    target.dispatchEvent(createKeyEvent('keydown', 'KeyD'));

    expect(received).toEqual([]);
  });
});
