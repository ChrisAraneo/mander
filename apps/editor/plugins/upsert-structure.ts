import { replace, trimEnd } from 'lodash-es';
import { match } from 'ts-pattern';

export interface Upsert {
  source: string;
  created: boolean;
}

const blockOf = (name: string): RegExp =>
  new RegExp(
    `export const ${name}: (?:Vertical)?Structure = \\[[\\s\\S]*?\\n\\];`,
  );

const declarationOf = (name: string, type: string, text: string): string =>
  `export const ${name}: ${type} = ${text};`;

const appended = (source: string, declaration: string): string =>
  `${trimEnd(source)}\n\n${declaration}\n`;

export const upsertStructure = (
  source: string,
  name: string,
  text: string,
  type = 'Structure',
): Upsert =>
  match(blockOf(name).test(source))
    .with(true, (): Upsert => ({
      source: replace(source, blockOf(name), () =>
        declarationOf(name, type, text),
      ),
      created: false,
    }))
    .otherwise((): Upsert => ({
      source: appended(source, declarationOf(name, type, text)),
      created: true,
    }));
