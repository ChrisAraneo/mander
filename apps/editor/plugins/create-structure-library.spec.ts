import { invoke } from 'lodash-es';
import { rm } from 'node:fs/promises';
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from 'node:http';
import { resolve } from 'node:path';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createStructureLibrary } from './create-structure-library.ts';
import { createLibraryRoot } from './test/create-library-root.ts';

const { number } = P;

type Middleware = (request: IncomingMessage, response: ServerResponse) => void;

type Registration = [path: string, middleware: Middleware];

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

const runConfigureServer = (
  root: string,
  registrations: Registration[],
): unknown =>
  invoke(createStructureLibrary(), 'configureServer', {
    config: { root },
    middlewares: {
      use: (path: string, middleware: Middleware): number =>
        registrations.push([path, middleware]),
    },
  });

const startServer = (middleware: Middleware): Promise<Server> =>
  pipe(
    middleware,
    (handler) => createServer(handler),
    (server) =>
      new Promise<Server>((resolveServer) =>
        server.listen(0, () => resolveServer(server)),
      ),
  );

const formatUrl = (server: Server): string =>
  match(server.address())
    .with({ port: number }, ({ port }) => `http://127.0.0.1:${port}/`)
    .otherwise(() => '');

describe('createStructureLibrary', () => {
  it('should serve the structure api and hand nothing back to vite when the dev server is configured', () => {
    const registrations: Registration[] = [];

    const configured = runConfigureServer(
      '/nowhere/apps/editor',
      registrations,
    );

    expect(configured).toBeUndefined();
    expect(registrations).toHaveLength(1);
    expect(registrations[0][0]).toBe('/api/structures');
  });

  it('should answer with the library as json when the api is read', async () => {
    const root = await createLibraryRoot({
      'normal.ts': `export const NORMAL_001: Structure = ${TEXT};\n`,
      'hard.ts': '',
      'vertical.ts': '',
    });
    const registrations: Registration[] = [];
    runConfigureServer(root, registrations);
    const server = await startServer(registrations[0][1]);

    const response = await fetch(formatUrl(server));

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual([
      { name: 'NORMAL_001', pool: 'normal', text: TEXT },
    ]);

    server.close();
    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should answer with a server error when the posted body is not json', async () => {
    const registrations: Registration[] = [];
    runConfigureServer('/nowhere/apps/editor', registrations);
    const server = await startServer(registrations[0][1]);

    const response = await fetch(formatUrl(server), {
      method: 'POST',
      body: 'not json',
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      message: `SyntaxError: Unexpected token 'o', "not json" is not valid JSON`,
    });

    server.close();
  });
});
