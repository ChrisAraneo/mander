import { describe, expect, it } from 'vitest';

import { LIGHTING_VERTEX_SOURCE } from './lighting-vertex-source';

describe('LIGHTING_VERTEX_SOURCE', () => {
  it('should open with the version line because anything before it fails to compile', () => {
    expect(LIGHTING_VERTEX_SOURCE.startsWith('#version 300 es\n')).toBe(true);
  });
});
