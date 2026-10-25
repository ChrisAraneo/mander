import type { Ref } from 'vue';

export const patchRef = <T>(target: Ref<T>, value: T): T =>
  (target.value = value);
