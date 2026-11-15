import type { RecordableAction } from '../../state/types/recordable-action';

export interface RecordedAction {
  atStep: number;
  action: RecordableAction;
}
