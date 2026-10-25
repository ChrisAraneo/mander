import type { Pool } from '../types/pool.ts';

export const createImportPattern = (pool: Pool): RegExp =>
  new RegExp(`import \\{([^}]*?)\\} from '\\./${pool}';`);
