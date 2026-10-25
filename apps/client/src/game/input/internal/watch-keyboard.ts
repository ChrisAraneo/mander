import type { Action } from '@mander/engine';
import { fromEvent, merge, type Subject } from 'rxjs';
import type { Keyboard } from '../types/keyboard';
import { handleKeyboardEvent } from './handle-keyboard-event';

export const watchKeyboard = (
  target: EventTarget,
  actions: Subject<Action>,
): Keyboard => ({
  actions,
  subscription: merge(
    fromEvent<KeyboardEvent>(target, 'keydown'),
    fromEvent<KeyboardEvent>(target, 'keyup'),
  ).subscribe((event) => handleKeyboardEvent(event, actions)),
});
