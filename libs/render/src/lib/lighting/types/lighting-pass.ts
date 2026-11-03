import type { Tile } from '@mander/model';
import type { LightingUniforms } from './lighting-uniforms';

export interface LightingPass {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  uniforms: LightingUniforms;
  uploaded: { tiles: Tile[][] | undefined };
}
