import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import type { Keyboard } from './types/keyboard';

export const closeKeyboard = (keyboard: Keyboard): void =>
  pipe(
    keyboard,
    (current) => tap(current, () => current.subscription.unsubscribe()),
    (current) => current.actions.complete(),
  );
