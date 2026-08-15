import { map } from 'lodash-es';

import { parseStructure } from './parse-structure';
import type { Difficulty, StructureEntry } from './structure-entry';

const ENDPOINT = '/api/structures';

interface LibraryResponse {
  name: string;
  difficulty: Difficulty;
  text: string;
}

export interface SavedStructure {
  name: string;
  difficulty: Difficulty;
  created: boolean;
}

const failure = async (response: Response): Promise<never> => {
  const body = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  throw new Error(
    body?.message ?? `the editor server answered ${response.status}`,
  );
};

export const fetchLibrary = async (): Promise<StructureEntry[]> => {
  const response = await fetch(ENDPOINT);

  if (!response.ok) return failure(response);

  return map(
    (await response.json()) as LibraryResponse[],
    (entry): StructureEntry => ({
      name: entry.name,
      difficulty: entry.difficulty,
      grid: parseStructure(entry.text),
    }),
  );
};

export const postStructure = async (
  name: string,
  text: string,
): Promise<SavedStructure> => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, text }),
  });

  if (!response.ok) return failure(response);

  return (await response.json()) as SavedStructure;
};
