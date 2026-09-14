import { replace, trimEnd } from 'lodash-es';
import { match } from 'ts-pattern';

export interface Upsert {
  source: string;
  isCreated: boolean;
}

const createBlockPattern = (name: string): RegExp =>
  new RegExp(
    `export const ${name}: (?:Vertical)?Structure = \\[[\\s\\S]*?\\n\\];`,
  );

const formatDeclaration = (name: string, type: string, text: string): string =>
  `export const ${name}: ${type} = ${text};`;

const appendDeclaration = (source: string, declaration: string): string =>
  `${trimEnd(source)}\n\n${declaration}\n`;

export const upsertStructure = (
  source: string,
  name: string,
  text: string,
  type = 'Structure',
): Upsert =>
  match(createBlockPattern(name).test(source))
    .with(true, (): Upsert => ({
      source: replace(source, createBlockPattern(name), () =>
        formatDeclaration(name, type, text),
      ),
      isCreated: false,
    }))
    .otherwise((): Upsert => ({
      source: appendDeclaration(source, formatDeclaration(name, type, text)),
      isCreated: true,
    }));
