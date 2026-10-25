import { entries, map } from 'lodash-es';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LIBRARY_DIR = 'libs/structures/src/lib';

const EDITOR_DIR = 'apps/editor';

export const createLibraryRoot = (
  files: Readonly<Record<string, string>>,
): Promise<string> =>
  mkdtemp(join(tmpdir(), 'mander-editor-')).then((base) =>
    mkdir(join(base, LIBRARY_DIR), { recursive: true })
      .then(() =>
        Promise.all(
          map(entries(files), ([file, source]) =>
            writeFile(join(base, LIBRARY_DIR, file), source, 'utf8'),
          ),
        ),
      )
      .then(() => join(base, EDITOR_DIR)),
  );
