import { map } from 'lodash-es';
import type { StructureBlock } from './types/structure-block.ts';

const BLOCK =
  /export const ([A-Z]+_\d+): (?:Vertical)?Structure = (\[[\s\S]*?\n\]);/g;

export const parseStructures = (source: string): StructureBlock[] =>
  map([...source.matchAll(BLOCK)], ([, name, text]): StructureBlock => ({
    name,
    text,
  }));
