import { constant, map } from 'lodash-es';
import { match } from 'ts-pattern';

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

const failure = (response: Response): Promise<never> =>
  response
    .json()
    .then(
      (body) => (body as { message?: string } | null)?.message,
      constant(undefined),
    )
    .then((message) =>
      Promise.reject(
        new Error(message ?? `the editor server answered ${response.status}`),
      ),
    );

const toEntry = (entry: LibraryResponse): StructureEntry => ({
  name: entry.name,
  difficulty: entry.difficulty,
  grid: parseStructure(entry.text),
});

export const fetchLibrary = (): Promise<StructureEntry[]> =>
  fetch(ENDPOINT).then((response) =>
    match(response.ok)
      .with(false, () => failure(response))
      .otherwise(() =>
        response.json().then((body) => map(body as LibraryResponse[], toEntry)),
      ),
  );

export const postStructure = (
  name: string,
  text: string,
): Promise<SavedStructure> =>
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, text }),
  }).then((response) =>
    match(response.ok)
      .with(false, () => failure(response))
      .otherwise(() => response.json() as Promise<SavedStructure>),
  );
