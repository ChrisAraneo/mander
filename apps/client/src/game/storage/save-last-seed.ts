import { loadSave } from './load-save';
import { persist } from './persist';

export function saveLastSeed(lastSeed: string): void {
  persist({ ...loadSave(), lastSeed });
}
