import type { Action } from '@mander/engine';

export interface KeyBinding {
  code: string;
  start: Action;
  stop?: Action;
}
