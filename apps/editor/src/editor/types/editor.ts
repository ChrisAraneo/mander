import type { Layers } from '@mander/model';
import type { ComputedRef, Ref } from 'vue';
import type { Brush } from './brush';
import type { Pool } from './pool';

export interface Editor {
  pool: Readonly<Ref<Pool>>;
  sketch: Ref<Layers>;
  brush: Ref<Brush>;
  history: Ref<Layers[]>;
  issues: ComputedRef<string[]>;
  isValid: ComputedRef<boolean>;
  canUndo: ComputedRef<boolean>;
  output: ComputedRef<string>;
}
