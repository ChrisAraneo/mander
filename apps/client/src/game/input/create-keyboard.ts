import type { Action } from '@mander/engine';
import { noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { fromEvent, merge, Subject } from 'rxjs';
import { match, P } from 'ts-pattern';
import { findKeyBinding } from './internal/find-key-binding';
import { toKeyAction } from './internal/to-key-action';
import type { Keyboard } from './types/keyboard';

const { nullish } = P;

const handleKeyboardEvent = (
  event: KeyboardEvent,
  actions: Subject<Action>,
): void =>
  match(findKeyBinding(event.code))
    .with(nullish, noop)
    .otherwise((binding) =>
      pipe(
        binding,
        (found) => tap(found, () => event.preventDefault()),
        (found) => toKeyAction(found, event.type, event.repeat),
        (action) =>
          match(action)
            .with(nullish, noop)
            .otherwise((next) => actions.next(next)),
      ),
    );

const watchKeyboard = (
  target: EventTarget,
  actions: Subject<Action>,
): Keyboard => ({
  actions,
  subscription: merge(
    fromEvent<KeyboardEvent>(target, 'keydown'),
    fromEvent<KeyboardEvent>(target, 'keyup'),
  ).subscribe((event) => handleKeyboardEvent(event, actions)),
});

export const createKeyboard = (target: EventTarget): Keyboard =>
  watchKeyboard(target, new Subject<Action>());
