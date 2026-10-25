import { difference, isEmpty, reduce, replace } from 'lodash-es';
import { match } from 'ts-pattern';
import { addName } from './add-name.ts';
import { parseAliases } from './internal/parse-aliases.ts';
import { splitNames } from './split-names.ts';

const IMPORT = /import \{([^}]*)\} from '\.\/consts';/;

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
