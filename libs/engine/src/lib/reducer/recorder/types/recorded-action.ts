import type { RecordableAction } from '../../types/recordable-action';

export interface RecordedAction {
  atStep: number;
  action: RecordableAction;
}
