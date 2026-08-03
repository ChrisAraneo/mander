import { loadSave } from './load-save';
import { persist } from './persist';

export const saveScore = (score: number): void => {
  persist({ ...loadSave(), score });
};
