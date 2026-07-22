import type { Action } from '@mander/engine';
import type { Observable } from 'rxjs';

export interface Keyboard {
  actions$: Observable<Action>;
  dispose(): void;
}
