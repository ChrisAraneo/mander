import { getPrefix } from '../get-prefix.ts';
import type { Pool } from '../types/pool.ts';

export const createLibraryPattern = (pool: Pool): RegExp =>
  new RegExp(
    `export const ${getPrefix(pool)}_LIBRARY = Object\\.freeze\\(\\{([^}]*?)\\}\\);`,
  );
