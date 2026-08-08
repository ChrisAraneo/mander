import type { Action } from '../../actions/types/actions';

export interface RecordedAction {
  atMs: number;
  action: Action;
}
