import { match } from 'ts-pattern';

import { appendName, hasName } from './append-name.ts';
import { type Pool, prefixOf } from './pool.ts';

const importOf = (pool: Pool): RegExp =>
  new RegExp(`import \\{([^}]*?)\\} from '\\./${pool}';`);

const libraryOf = (pool: Pool): RegExp =>
  new RegExp(
    `export const ${prefixOf(pool)}_LIBRARY = Object\\.freeze\\(\\{([^}]*?)\\}\\);`,
  );

const withName = (source: string, pattern: RegExp, name: string): string =>
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
  withName(withName(source, importOf(pool), name), libraryOf(pool), name);
