import type { Item } from '@mander/generator';

import { loadSave } from './load-save';
import { persist } from './persist';

export const saveInventory = (inventory: Item[]): void => {
  persist({ ...loadSave(), inventory });
};
