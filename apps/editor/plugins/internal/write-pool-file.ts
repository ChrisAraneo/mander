import { constant } from 'lodash-es';
import { readFile, writeFile } from 'node:fs/promises';
import { pipe } from 'remeda';
import { addAliases } from '../add-aliases.ts';
import { getType } from '../get-type.ts';
import { patchStructure } from '../patch-structure.ts';
import { toOriginalEndings } from '../to-original-endings.ts';
import type { Pool } from '../types/pool.ts';

export const writePoolFile = (
  path: string,
  name: string,
  pool: Pool,
  text: string,
): Promise<boolean> =>
  readFile(path, 'utf8').then((original) =>
    pipe(
      addAliases(original, text),
      (aliased) => patchStructure(aliased, name, text, getType(pool)),
      ({ source, isCreated }) =>
        writeFile(path, toOriginalEndings(source, original), 'utf8').then(
          constant(isCreated),
        ),
    ),
  );
