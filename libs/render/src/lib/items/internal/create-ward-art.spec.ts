import { describe, expect, it } from 'vitest';

import { createWardArt } from './create-ward-art';

describe('createWardArt', () => {
  it('should show the helmet when the item wards off ceiling spikes', () => {
    const result = createWardArt('CEILING_SPIKE');

    expect(result).toEqual({ kind: 'HELMET' });
  });

  it('should show the boots when the item wards off floor spikes', () => {
    const result = createWardArt('FLOOR_SPIKE');

    expect(result).toEqual({ kind: 'BOOTS' });
  });
});
