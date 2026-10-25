import { writeLibraryFile } from './internal/write-library-file.ts';
import { writePoolFile } from './internal/write-pool-file.ts';
import type { Pool } from './types/pool.ts';
import type { SavedStructure } from './types/saved-structure.ts';
import type { StructurePaths } from './types/structure-paths.ts';

export const writeStructureFiles = (
  paths: StructurePaths,
  name: string,
  pool: Pool,
  text: string,
): Promise<SavedStructure> =>
  writePoolFile(paths.structures[pool], name, pool, text).then((isCreated) =>
    writeLibraryFile(paths.library, name, pool).then((): SavedStructure => ({
      name,
      pool,
      isCreated,
    })),
  );
