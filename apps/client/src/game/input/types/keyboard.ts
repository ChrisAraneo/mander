import type { Action } from '@mander/engine';
import type { Subject, Subscription } from 'rxjs';

export interface Keyboard {
  actions: Subject<Action>;
  subscription: Subscription;
}
