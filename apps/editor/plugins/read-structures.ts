const BLOCK = /export const ([A-Z]+_\d+): Structure = (\[[\s\S]*?\n\]);/g;

export interface StructureBlock {
  name: string;
  text: string;
}

export const readStructures = (source: string): StructureBlock[] =>
  [...source.matchAll(BLOCK)].map(([, name, text]) => ({ name, text }));
