import { isObjectLike } from 'lodash-es';
import type { SaveData } from '../types/save-data';

export const isSaveShape = (value: unknown): value is Partial<SaveData> =>
  isObjectLike(value);
