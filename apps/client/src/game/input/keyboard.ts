import type { Observable } from 'rxjs';
import type { Action } from '@mander/engine';

export interface Keyboard {
  actions$: Observable<Action>;
  dispose(): void;
}
