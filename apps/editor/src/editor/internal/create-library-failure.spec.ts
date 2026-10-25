import { describe, expect, it } from 'vitest';

import { createLibraryFailure } from './create-library-failure';

describe('createLibraryFailure', () => {
  it('should fail with the message of the server when the answer carries one', async () => {
    await expect(
      createLibraryFailure(
        new Response(
          JSON.stringify({ message: 'the grid is not a structure literal' }),
          {
            status: 400,
          },
        ),
      ),
    ).rejects.toThrow('the grid is not a structure literal');
  });

  it('should fail with the status when the answer carries no message', async () => {
    await expect(
      createLibraryFailure(new Response('{}', { status: 502 })),
    ).rejects.toThrow('the editor server answered 502');
  });

  it('should fail with the status when the answer is not json', async () => {
    await expect(
      createLibraryFailure(new Response('<html>', { status: 500 })),
    ).rejects.toThrow('the editor server answered 500');
  });
});
