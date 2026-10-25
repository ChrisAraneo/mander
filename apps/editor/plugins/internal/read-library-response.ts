import { readLibrary } from '../read-library.ts';
import type { StructurePaths } from '../types/structure-paths.ts';
import type { StructureResponse } from './types/structure-response.ts';

export const readLibraryResponse = (
  paths: StructurePaths,
): Promise<StructureResponse> =>
  readLibrary(paths).then((library): StructureResponse => ({
    status: 200,
    body: library,
  }));
