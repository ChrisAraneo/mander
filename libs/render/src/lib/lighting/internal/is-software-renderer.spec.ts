import { describe, expect, it } from 'vitest';

import { createRecordingGl } from '../../../test/create-recording-gl';
import { isSoftwareRenderer } from './is-software-renderer';

const isRendererSoftware = (renderer: string): boolean =>
  isSoftwareRenderer(createRecordingGl({ renderer }).gl);

describe('isSoftwareRenderer', () => {
  it('should be true when Chrome falls back to SwiftShader', () => {
    expect(
      isRendererSoftware(
        'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)',
      ),
    ).toBe(true);
  });

  it('should be true when Linux falls back to llvmpipe', () => {
    expect(isRendererSoftware('llvmpipe (LLVM 15.0.7, 256 bits)')).toBe(true);
  });

  it('should be true when Windows falls back to its basic driver', () => {
    expect(isRendererSoftware('Microsoft Basic Render Driver')).toBe(true);
  });

  it('should be false when there is a real graphics card', () => {
    expect(
      isRendererSoftware('ANGLE (NVIDIA, NVIDIA GeForce RTX 3080, D3D11)'),
    ).toBe(false);
  });

  it('should be false when there is an integrated graphics chip', () => {
    expect(isRendererSoftware('ANGLE (Intel, Intel(R) UHD Graphics 620)')).toBe(
      false,
    );
  });
});
