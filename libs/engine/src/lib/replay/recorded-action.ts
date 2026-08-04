import type { Action } from '../actions/actions';

export interface RecordedAction {
  atMs: number;
  action: Action;
}
