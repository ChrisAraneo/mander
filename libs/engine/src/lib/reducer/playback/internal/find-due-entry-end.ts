import { match } from 'ts-pattern';
import type { RecordedAction } from '../../recorder/types/recorded-action';

export const findDueEntryEnd = (
  entries: RecordedAction[],
  index: number,
  step: number,
): number =>
  match<RecordedAction | undefined>(entries[index])
    .with({ atStep: step }, () => findDueEntryEnd(entries, index + 1, step))
    .otherwise(() => index);
