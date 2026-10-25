import { pipe } from 'remeda';
import { addStatementName } from './internal/add-statement-name.ts';
import { createImportPattern } from './internal/create-import-pattern.ts';
import { createLibraryPattern } from './internal/create-library-pattern.ts';
import type { Pool } from './types/pool.ts';

export const addStructure = (
  source: string,
  name: string,
  pool: Pool,
): string =>
  pipe(
    source,
    (imported) => addStatementName(imported, createImportPattern(pool), name),
    (listed) => addStatementName(listed, createLibraryPattern(pool), name),
  );
