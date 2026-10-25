import { readSave } from './read-save';
import { writeSave } from './write-save';

export const writeScore = (
  score: number,
  storage: Storage | undefined,
): boolean => writeSave({ ...readSave(storage), score }, storage);
