import { match } from 'ts-pattern';

import { appendName, hasName } from './append-name.ts';
import { type Pool, prefixOf } from './pool.ts';

const importOf = (pool: Pool): RegExp =>
  new RegExp(`import \\{([\\s\\S]*?)\\} from '\\./${pool}';`);

const arrayOf = (pool: Pool): RegExp =>
  new RegExp(
    `export const ${prefixOf(pool)}_STRUCTURES: readonly Structure\\[\\] = Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\);`,
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
  withName(withName(source, importOf(pool), name), arrayOf(pool), name);
