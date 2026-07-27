import type { State } from '../types/state';
import { showToast } from './show-toast';
import { writeClipboard } from '../dom/write-clipboard';

export const copyOutput = async (state: State): Promise<void> => {
  await writeClipboard(state.output);
  showToast(
    state.toast,
    'Copied! Paste it into a pool in structures/library.ts',
  );
};
