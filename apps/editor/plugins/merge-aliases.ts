import { difference, isEmpty, map, reduce, uniq } from 'lodash-es';
import { match } from 'ts-pattern';

import { appendName, listNames } from './append-name.ts';

const IMPORT = /import \{([^}]*)\} from '\.\/consts';/;

const TOKEN = /[A-Za-z_][A-Za-z0-9_]*/g;

const aliasesIn = (text: string): string[] =>
  uniq(map([...text.matchAll(TOKEN)], ([alias]) => alias));

export const mergeAliases = (source: string, text: string): string =>
  match(IMPORT.exec(source))
    .with(null, () => source)
    .otherwise(([statement, list]) =>
      match(difference(aliasesIn(text), listNames(list)))
        .when(isEmpty, () => source)
        .otherwise((missing) =>
          source.replace(statement, () =>
            statement.replace(list, () => reduce(missing, appendName, list)),
          ),
        ),
    );
