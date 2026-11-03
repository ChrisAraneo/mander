const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|software|basic render/i;

export const isSoftwareRenderer = (gl: WebGL2RenderingContext): boolean =>
  SOFTWARE_RENDERER.test(
    String(
      gl.getParameter(
        gl.getExtension('WEBGL_debug_renderer_info')?.UNMASKED_RENDERER_WEBGL ??
          gl.RENDERER,
      ),
    ),
  );
