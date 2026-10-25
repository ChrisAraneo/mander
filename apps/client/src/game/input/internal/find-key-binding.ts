import { find } from 'lodash-es';
import { BINDINGS } from '../bindings';
import type { KeyBinding } from '../types/key-binding';

export const findKeyBinding = (code: string): KeyBinding | undefined =>
  find(BINDINGS, (binding) => binding.code === code);
