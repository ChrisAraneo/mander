import type { Action } from '@mander/engine';
import { noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import type { Subject } from 'rxjs';
import { match, P } from 'ts-pattern';
import { findKeyBinding } from './find-key-binding';
import { toKeyAction } from './to-key-action';

const { nullish } = P;

export const handleKeyboardEvent = (
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
