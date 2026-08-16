import type { Ref } from 'vue';

/**
 * Writes a ref and hands the value back, so publishing state stays an
 * expression a `.thru()` step can carry.
 */
export const setRef = <T>(target: Ref<T>, value: T): T =>
  (target.value = value);
