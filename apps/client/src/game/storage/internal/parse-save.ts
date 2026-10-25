import { pipe } from 'remeda';
import type { SaveData } from '../types/save-data';
import { toSaveData } from './to-save-data';
import { tryParseSaveJson } from './try-parse-save-json';

export const parseSave = (raw: string | null): SaveData =>
  pipe(raw, tryParseSaveJson, toSaveData);
