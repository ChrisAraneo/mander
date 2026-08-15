import { match } from 'ts-pattern';

export interface Upsert {
  source: string;
  created: boolean;
}

const blockOf = (name: string): RegExp =>
  new RegExp(`export const ${name}: Structure = \\[[\\s\\S]*?\\n\\];`);

const declarationOf = (name: string, text: string): string =>
  `export const ${name}: Structure = ${text};`;

const appended = (source: string, declaration: string): string =>
  `${source.replace(/\s+$/, '')}\n\n${declaration}\n`;

export const upsertStructure = (
  source: string,
  name: string,
  text: string,
): Upsert =>
  match(blockOf(name).test(source))
    .with(true, (): Upsert => ({
      source: source.replace(blockOf(name), () => declarationOf(name, text)),
      created: false,
    }))
    .otherwise((): Upsert => ({
      source: appended(source, declarationOf(name, text)),
      created: true,
    }));
