import type { Action } from '@mander/engine';
import { match } from 'ts-pattern';
import type { KeyBinding } from '../types/key-binding';

const NO_ACTION: Action | undefined = undefined;

export const toKeyAction = (
  binding: KeyBinding,
  type: string,
  isRepeat: boolean,
): Action | undefined =>
  match({ type, isRepeat })
    .with({ type: 'keydown', isRepeat: true }, () => NO_ACTION)
    .with({ type: 'keydown' }, () => binding.start)
    .otherwise(() => binding.stop);
