import type { Pool } from '../types/pool.ts';
import type { StructurePaths } from '../types/structure-paths.ts';
import { writeStructureFiles } from '../write-structure-files.ts';
import type { StructureResponse } from './types/structure-response.ts';

export const writeSavedResponse = (
  paths: StructurePaths,
  name: string,
  pool: Pool,
  text: string,
): Promise<StructureResponse> =>
  writeStructureFiles(paths, name, pool, text).then(
    (saved): StructureResponse => ({ status: 200, body: saved }),
  );
