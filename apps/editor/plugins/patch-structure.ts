import { replace } from 'lodash-es';
import { match } from 'ts-pattern';
import { addDeclaration } from './internal/add-declaration.ts';
import { createBlockPattern } from './internal/create-block-pattern.ts';
import { formatStructureDeclaration } from './internal/format-structure-declaration.ts';
import type { StructurePatch } from './types/structure-patch.ts';

export const patchStructure = (
  source: string,
  name: string,
  text: string,
  type = 'Structure',
): StructurePatch =>
  match(createBlockPattern(name).test(source))
    .with(true, (): StructurePatch => ({
      source: replace(source, createBlockPattern(name), () =>
        formatStructureDeclaration(name, type, text),
      ),
      isCreated: false,
    }))
    .otherwise((): StructurePatch => ({
      source: addDeclaration(
        source,
        formatStructureDeclaration(name, type, text),
      ),
      isCreated: true,
    }));
