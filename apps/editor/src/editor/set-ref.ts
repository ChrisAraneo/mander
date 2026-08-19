import type { Ref } from 'vue';

export const setRef = <T>(target: Ref<T>, value: T): T =>
  (target.value = value);
