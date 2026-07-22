import type { Action } from '@mander/engine';
import { fromEvent, merge, type Subscription } from 'rxjs';
import { Subject } from 'rxjs';

import { BINDINGS } from './bindings';
import type { Keyboard } from './keyboard';

export function createKeyboard(): Keyboard {
  const actions = new Subject<Action>();

  const keydown$ = fromEvent<KeyboardEvent>(window, 'keydown');
  const keyup$ = fromEvent<KeyboardEvent>(window, 'keyup');

  const subscription: Subscription = merge(keydown$, keyup$).subscribe(
    (event) => {
      const binding = BINDINGS[event.code];
      if (!binding) return;
      event.preventDefault();
      if (event.type === 'keydown') {
        if (!event.repeat) actions.next(binding.start);
      } else if (binding.stop) {
        actions.next(binding.stop);
      }
    },
  );

  return {
    actions$: actions.asObservable(),
    dispose() {
      subscription.unsubscribe();
      actions.complete();
    },
  };
}
