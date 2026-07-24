import type { Action } from '@mander/engine';
import { fromEvent, merge, type Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { match, P } from 'ts-pattern';

import { BINDINGS } from './bindings';
import type { Keyboard } from './keyboard';

const { nullish } = P;

export const createKeyboard = (): Keyboard => {
  const actions = new Subject<Action>();
  const bindingByCode = new Map(
    BINDINGS.map((binding) => [binding.code, binding]),
  );

  const keydown$ = fromEvent<KeyboardEvent>(window, 'keydown');
  const keyup$ = fromEvent<KeyboardEvent>(window, 'keyup');

  const subscription: Subscription = merge(keydown$, keyup$).subscribe(
    (event) =>
      match(bindingByCode.get(event.code))
        .with(nullish, () => undefined)
        .otherwise((binding) => {
          event.preventDefault();
          return match(event.type)
            .with('keydown', () =>
              match(event.repeat)
                .with(true, () => undefined)
                .otherwise(() => actions.next(binding.start)),
            )
            .otherwise(() =>
              match(binding.stop)
                .with(nullish, () => undefined)
                .otherwise((stop) => actions.next(stop)),
            );
        }),
  );

  return {
    actions$: actions.asObservable(),
    dispose() {
      subscription.unsubscribe();
      actions.complete();
    },
  };
};
