import { match } from 'ts-pattern';

import { appendName, hasName } from './append-name.ts';
import { getPrefix, type Pool } from './pool.ts';

const createImportPattern = (pool: Pool): RegExp =>
  new RegExp(`import \\{([^}]*?)\\} from '\\./${pool}';`);

const createLibraryPattern = (pool: Pool): RegExp =>
  new RegExp(
    `export const ${getPrefix(pool)}_LIBRARY = Object\\.freeze\\(\\{([^}]*?)\\}\\);`,
  );

const insertName = (source: string, pattern: RegExp, name: string): string =>
  match(pattern.exec(source))
    .with(null, () => source)
    .otherwise(([statement, list]) =>
      match(hasName(list, name))
        .with(true, () => source)
        .otherwise(() =>
          source.replace(statement, () =>
            statement.replace(list, () => appendName(list, name)),
          ),
        ),
    );

export const registerStructure = (
  source: string,
  name: string,
  pool: Pool,
): string =>
  insertName(
    insertName(source, createImportPattern(pool), name),
    createLibraryPattern(pool),
    name,
  );
