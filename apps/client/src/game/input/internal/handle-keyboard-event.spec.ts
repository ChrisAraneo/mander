import type { Action } from '@mander/engine';
import { assign, tap } from 'lodash-es';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { handleKeyboardEvent } from './handle-keyboard-event';

const createKeyEvent = (
  type: string,
  code: string,
  repeat = false,
): KeyboardEvent =>
  assign(new Event(type, { cancelable: true }), {
    code,
    repeat,
  }) as unknown as KeyboardEvent;

const watchActions = (actions: Subject<Action>): Action[] =>
  tap(new Array<Action>(), (received) =>
    actions.subscribe((action) => received.push(action)),
  );

describe('handleKeyboardEvent', () => {
  it('should start the move when a bound key goes down', () => {
    const actions = new Subject<Action>();
    const received = watchActions(actions);

    handleKeyboardEvent(createKeyEvent('keydown', 'KeyA'), actions);

    expect(received).toEqual([{ type: 'MOVE_LEFT_START' }]);
  });

  it('should stop the move when a bound key goes up', () => {
    const actions = new Subject<Action>();
    const received = watchActions(actions);

    handleKeyboardEvent(createKeyEvent('keyup', 'KeyA'), actions);

    expect(received).toEqual([{ type: 'MOVE_LEFT_STOP' }]);
  });

  it('should send nothing when the key repeats while held down', () => {
    const actions = new Subject<Action>();
    const received = watchActions(actions);

    handleKeyboardEvent(createKeyEvent('keydown', 'KeyA', true), actions);

    expect(received).toEqual([]);
  });

  it('should send nothing when a key without a stop action goes up', () => {
    const actions = new Subject<Action>();
    const received = watchActions(actions);

    handleKeyboardEvent(createKeyEvent('keyup', 'Space'), actions);

    expect(received).toEqual([]);
  });

  it('should keep the page from handling the key when the key is bound', () => {
    const event = createKeyEvent('keydown', 'Space');

    handleKeyboardEvent(event, new Subject<Action>());

    expect(event.defaultPrevented).toBe(true);
  });

  it('should send nothing and let the page handle the key when the key is not bound', () => {
    const actions = new Subject<Action>();
    const received = watchActions(actions);
    const event = createKeyEvent('keydown', 'KeyQ');

    handleKeyboardEvent(event, actions);

    expect(received).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });
});
