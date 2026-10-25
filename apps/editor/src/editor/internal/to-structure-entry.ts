import { parseStructure } from '../parse-structure';
import type { LibraryResponse } from '../types/library-response';
import type { StructureEntry } from '../types/structure-entry';

export const toStructureEntry = (entry: LibraryResponse): StructureEntry => ({
  name: entry.name,
  pool: entry.pool,
  sketch: parseStructure(entry.text),
});
