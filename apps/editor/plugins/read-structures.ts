import { map } from 'lodash-es';

const BLOCK = /export const ([A-Z]+_\d+): Structure = (\[[\s\S]*?\n\]);/g;

export interface StructureBlock {
  name: string;
  text: string;
}

export const readStructures = (source: string): StructureBlock[] =>
  map([...source.matchAll(BLOCK)], ([, name, text]) => ({ name, text }));
