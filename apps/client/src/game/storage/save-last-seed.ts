import { loadSave } from './load-save';
import { persist } from './persist';

export const saveLastSeed = (lastSeed: string): void => {
  persist({ ...loadSave(), lastSeed });
};
