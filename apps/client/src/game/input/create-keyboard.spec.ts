import type { Action } from '@mander/engine';
import { assign, map, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createKeyboard } from './create-keyboard';

const createKeyEvent = (type: string, code: string, repeat = false): Event =>
  assign(new Event(type, { cancelable: true }), { code, repeat });

const runKeyboard = (target: EventTarget, events: Event[]): Action[] =>
  pipe(
    { actions: new Array<Action>(), keyboard: createKeyboard(target) },
    (collected) =>
      tap(collected, () =>
        collected.keyboard.actions.subscribe((action) =>
          collected.actions.push(action),
        ),
      ),
    (collected) =>
      tap(collected, () => map(events, (event) => target.dispatchEvent(event))),
    ({ actions }) => actions,
  );

describe('createKeyboard', () => {
  it('should start and stop the move when a bound key goes down and up', () => {
    expect(
      runKeyboard(new EventTarget(), [
        createKeyEvent('keydown', 'KeyA'),
        createKeyEvent('keyup', 'KeyA'),
      ]),
    ).toEqual([{ type: 'MOVE_LEFT_START' }, { type: 'MOVE_LEFT_STOP' }]);
  });

  it('should ignore the key when it repeats while held down', () => {
    expect(
      runKeyboard(new EventTarget(), [
        createKeyEvent('keydown', 'KeyA'),
        createKeyEvent('keydown', 'KeyA', true),
      ]),
    ).toEqual([{ type: 'MOVE_LEFT_START' }]);
  });

  it('should ignore the key when it is not bound', () => {
    expect(
      runKeyboard(new EventTarget(), [createKeyEvent('keydown', 'KeyQ')]),
    ).toEqual([]);
  });

  it('should keep the page from handling the key when the key is bound', () => {
    const event = createKeyEvent('keydown', 'Space');

    runKeyboard(new EventTarget(), [event]);

    expect(event.defaultPrevented).toBe(true);
  });

  it('should let the page handle the key when the key is not bound', () => {
    const event = createKeyEvent('keydown', 'KeyQ');

    runKeyboard(new EventTarget(), [event]);

    expect(event.defaultPrevented).toBe(false);
  });
});
