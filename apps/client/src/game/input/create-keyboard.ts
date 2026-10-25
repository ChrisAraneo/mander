import type { Action } from '@mander/engine';
import { Subject } from 'rxjs';
import { watchKeyboard } from './internal/watch-keyboard';
import type { Keyboard } from './types/keyboard';

export const createKeyboard = (target: EventTarget): Keyboard =>
  watchKeyboard(target, new Subject<Action>());
