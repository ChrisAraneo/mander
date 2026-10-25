import { constant } from 'lodash-es';
import { readFile, writeFile } from 'node:fs/promises';
import { pipe } from 'remeda';
import { addAliases } from './add-aliases.ts';
import { addStructure } from './add-structure.ts';
import { getType } from './get-type.ts';
import { patchStructure } from './patch-structure.ts';
import { toOriginalEndings } from './to-original-endings.ts';
import type { Pool } from './types/pool.ts';
import type { SavedStructure } from './types/saved-structure.ts';
import type { StructurePaths } from './types/structure-paths.ts';

const writePoolFile = (
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

const writeLibraryFile = (
  path: string,
  name: string,
  pool: Pool,
): Promise<void> =>
  readFile(path, 'utf8').then((original) =>
    writeFile(
      path,
      toOriginalEndings(addStructure(original, name, pool), original),
      'utf8',
    ),
  );

export const writeStructureFiles = (
  paths: StructurePaths,
  name: string,
  pool: Pool,
  text: string,
): Promise<SavedStructure> =>
  writePoolFile(paths.structures[pool], name, pool, text).then((isCreated) =>
    writeLibraryFile(paths.library, name, pool).then((): SavedStructure => ({
      name,
      pool,
      isCreated,
    })),
  );
