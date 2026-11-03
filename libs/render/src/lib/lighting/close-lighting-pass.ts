import { tap } from 'lodash-es';
import type { LightingPass } from './types/lighting-pass';

export const closeLightingPass = (pass: LightingPass): LightingPass =>
  tap(pass, ({ gl }) => gl.getExtension('WEBGL_lose_context')?.loseContext());
