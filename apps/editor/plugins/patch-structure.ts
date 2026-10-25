import { replace, trimEnd } from 'lodash-es';
import { match } from 'ts-pattern';
import type { StructurePatch } from './types/structure-patch.ts';

const createBlockPattern = (name: string): RegExp =>
  new RegExp(
    `export const ${name}: (?:Vertical)?Structure = \\[[\\s\\S]*?\\n\\];`,
  );

const formatDeclaration = (name: string, type: string, text: string): string =>
  `export const ${name}: ${type} = ${text};`;

const addDeclaration = (source: string, declaration: string): string =>
  `${trimEnd(source)}\n\n${declaration}\n`;

export const patchStructure = (
  source: string,
  name: string,
  text: string,
  type = 'Structure',
): StructurePatch =>
  match(createBlockPattern(name).test(source))
    .with(true, (): StructurePatch => ({
      source: replace(source, createBlockPattern(name), () =>
        formatDeclaration(name, type, text),
      ),
      isCreated: false,
    }))
    .otherwise((): StructurePatch => ({
      source: addDeclaration(source, formatDeclaration(name, type, text)),
      isCreated: true,
    }));
