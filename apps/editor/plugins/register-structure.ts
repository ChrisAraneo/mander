import { match } from 'ts-pattern';

import { appendName, hasName } from './append-name';
import { type Difficulty, prefixOf } from './difficulty';

const importOf = (difficulty: Difficulty): RegExp =>
  new RegExp(`import \\{([\\s\\S]*?)\\} from '\\./${difficulty}';`);

const arrayOf = (difficulty: Difficulty): RegExp =>
  new RegExp(
    `export const ${prefixOf(difficulty)}_STRUCTURES: readonly Structure\\[\\] = Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\);`,
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
  difficulty: Difficulty,
): string =>
  withName(
    withName(source, importOf(difficulty), name),
    arrayOf(difficulty),
    name,
  );
