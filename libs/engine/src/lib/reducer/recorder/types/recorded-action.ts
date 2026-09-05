import type { RecordableAction } from '../../../actions/actions';

export interface RecordedAction {
  atStep: number;
  action: RecordableAction;
}
