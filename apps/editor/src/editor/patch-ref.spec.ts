import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { patchRef } from './patch-ref';

describe('patchRef', () => {
  it('should hold the new value and give it back when it is patched', () => {
    const count = ref(1);

    expect(patchRef(count, 2)).toBe(2);
    expect(count.value).toBe(2);
  });
});
