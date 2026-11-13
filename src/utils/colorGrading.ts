import type { CSSProperties } from 'react';

export const UNIVERSAL_COLD_GRADE_FILTER =
  'contrast(1.08) brightness(0.94) saturate(0.82) sepia(0.06) hue-rotate(-12deg)';

export const VINTAGE_SEPIA_GRADE_FILTER =
  'contrast(1.08) sepia(0.20) brightness(0.96)';

export const ARCHIVAL_COLD_GRADE_FILTER =
  'contrast(1.10) saturate(0.74) brightness(0.94) hue-rotate(-10deg)';

export const BW_HALFTONE_FILTER =
  'grayscale(1) contrast(1.45) brightness(1.04)';

export const BG_OPTICAL_DOF_FILTER =
  'blur(2.5px) contrast(1.06) brightness(0.96)';

export const UNIVERSAL_VIGNETTE_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  boxShadow: 'inset 0 0 120px rgba(0, 10, 20, 0.65)',
  pointerEvents: 'none',
};

export const CONTACT_SHADOW_MASK_STYLE: CSSProperties = {
  maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%)',
  WebkitMaskImage:
    'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%)',
};

export function getFilmGrainOverlayStyle(frame: number): CSSProperties {
  // Subtle animated silver-gelatin grain jitter without external dependencies
  const shiftX = ((frame * 37) % 19) - 9;
  const shiftY = ((frame * 53) % 17) - 8;
  return {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    pointerEvents: 'none',
    opacity: 0.09,
    mixBlendMode: 'overlay',
    backgroundImage:
      'radial-gradient(rgba(255,255,255,0.65) 0.6px, transparent 0.7px), radial-gradient(rgba(0,0,0,0.6) 0.6px, transparent 0.7px)',
    backgroundSize: '4px 4px, 5px 5px',
    backgroundPosition: `${shiftX}px ${shiftY}px, ${-shiftY}px ${shiftX}px`,
  };
}
