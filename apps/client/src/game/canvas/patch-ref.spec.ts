import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { patchRef } from './patch-ref';

describe('patchRef', () => {
  it('should hold the new value when it patches the ref', () => {
    const target = ref(1);

    patchRef(target, 2);

    expect(target.value).toBe(2);
  });

  it('should give back the value it wrote when it patches the ref', () => {
    expect(patchRef(ref('old'), 'new')).toBe('new');
  });
});
