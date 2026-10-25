import { replace } from 'lodash-es';
import { match } from 'ts-pattern';
import { addName } from '../add-name.ts';
import { containsName } from '../contains-name.ts';

export const addStatementName = (
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
