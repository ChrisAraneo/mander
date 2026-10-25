import { replace } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { addName } from './add-name.ts';
import { containsName } from './contains-name.ts';
import { getPrefix } from './get-prefix.ts';
import type { Pool } from './types/pool.ts';

const createImportPattern = (pool: Pool): RegExp =>
  new RegExp(`import \\{([^}]*?)\\} from '\\./${pool}';`);

const createLibraryPattern = (pool: Pool): RegExp =>
  new RegExp(
    `export const ${getPrefix(pool)}_LIBRARY = Object\\.freeze\\(\\{([^}]*?)\\}\\);`,
  );

const addStatementName = (
  source: string,
  pattern: RegExp,
  name: string,
): string =>
  match(pattern.exec(source))
    .with(null, () => source)
    .otherwise(([statement, list]) =>
      match(containsName(list, name))
        .with(true, () => source)
        .otherwise(() =>
          replace(source, statement, () =>
            replace(statement, list, () => addName(list, name)),
          ),
        ),
    );

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
