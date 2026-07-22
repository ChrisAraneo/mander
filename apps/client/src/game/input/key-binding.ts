import type { Action } from '@mander/engine';

export interface KeyBinding {
  start: Action;
  stop?: Action;
}
