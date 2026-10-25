import { difference, isEmpty, map, reduce, replace, uniq } from 'lodash-es';
import { match } from 'ts-pattern';
import { addName } from './add-name.ts';
import { splitNames } from './split-names.ts';

const IMPORT = /import \{([^}]*)\} from '\.\/consts';/;

const TOKEN = /[A-Za-z_][A-Za-z0-9_]*/g;

const parseAliases = (text: string): string[] =>
  uniq(map([...text.matchAll(TOKEN)], ([alias]) => alias));

export const addAliases = (source: string, text: string): string =>
  match(IMPORT.exec(source))
    .with(null, () => source)
    .otherwise(([statement, list]) =>
      match(difference(parseAliases(text), splitNames(list)))
        .when(isEmpty, () => source)
        .otherwise((missing) =>
          replace(source, statement, () =>
            replace(statement, list, () => reduce(missing, addName, list)),
          ),
        ),
    );
