import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';

export interface SceneTransitionWrapperProps {
  transitionIn?: string;
  durationInFrames: number;
  children: React.ReactNode;
}

export const SceneTransitionWrapper: React.FC<SceneTransitionWrapperProps> = ({
  transitionIn = 'panoramic_push_glide',
  children,
}) => {
  const frame = useCurrentFrame();
  const dur = 16;
  const p = interpolate(frame, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  });

  let wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  let overlayElement: React.ReactNode = null;

  switch (transitionIn) {
    case 'cold_open_fade_from_black': {
      const fade = interpolate(frame, [0, 18], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      wrapperStyle.opacity = fade;
      break;
    }
    case 'iris_zoom_through': {
      const radius = interpolate(p, [0, 1], [12, 120]);
      const scale = interpolate(p, [0, 1], [1.08, 1.0]);
      wrapperStyle.clipPath = `circle(${radius}% at 50% 50%)`;
      wrapperStyle.transform = `scale(${scale})`;
      break;
    }
    case 'halation_flash_dissolve': {
      const opacity = interpolate(frame, [0, 10], [0.15, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const flashOpacity = interpolate(frame, [0, 5, 16], [0.72, 0.35, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      wrapperStyle.opacity = opacity;
      overlayElement = (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff6e3',
            opacity: flashOpacity,
            pointerEvents: 'none',
            zIndex: 60,
          }}
        />
      );
      break;
    }
    case 'tectonic_vertical_rise': {
      const ty = interpolate(p, [0, 1], [110, 0]);
      wrapperStyle.transform = `translateY(${ty}px)`;
      wrapperStyle.opacity = interpolate(p, [0, 0.6], [0.35, 1], {
        extrapolateRight: 'clamp',
      });
      break;
    }
    case 'camera_pullback_through_monitor': {
      const scale = interpolate(p, [0, 1], [1.32, 1.0]);
      wrapperStyle.transform = `scale(${scale})`;
      wrapperStyle.opacity = interpolate(p, [0, 0.5], [0.4, 1], {
        extrapolateRight: 'clamp',
      });
      break;
    }
    case 'window_portal_push_through': {
      const scale = interpolate(p, [0, 1], [0.92, 1.0]);
      const clipInset = interpolate(p, [0, 1], [14, 0]);
      wrapperStyle.transform = `scale(${scale})`;
      wrapperStyle.clipPath = `inset(${clipInset}% ${clipInset}% ${clipInset}% ${clipInset}%)`;
      break;
    }
    case 'diagonal_shutter_wipe': {
      const pct = interpolate(p, [0, 1], [0, 145]);
      wrapperStyle.clipPath = `polygon(0 0, ${pct}% 0, ${Math.max(
        0,
        pct - 35
      )}% 100%, 0 100%)`;
      break;
    }
    case 'barrel_roll_stone_wipe': {
      const rot = interpolate(p, [0, 1], [-4, 0]);
      const scale = interpolate(p, [0, 1], [1.1, 1.0]);
      wrapperStyle.transform = `rotate(${rot}deg) scale(${scale})`;
      wrapperStyle.opacity = interpolate(p, [0, 0.5], [0.3, 1], {
        extrapolateRight: 'clamp',
      });
      break;
    }
    case 'foreground_pillar_whip_wipe': {
      const tx = interpolate(p, [0, 1], [240, 0]);
      wrapperStyle.transform = `translateX(${tx}px)`;
      wrapperStyle.opacity = interpolate(p, [0, 0.45], [0.3, 1], {
        extrapolateRight: 'clamp',
      });
      break;
    }
    case 'archival_pip_over_fullbleed': {
      const scale = interpolate(p, [0, 1], [0.88, 1.0]);
      wrapperStyle.transform = `scale(${scale})`;
      wrapperStyle.opacity = interpolate(p, [0, 0.5], [0.25, 1], {
        extrapolateRight: 'clamp',
      });
      break;
    }
    case 'panoramic_push_glide':
    default: {
      const scale = interpolate(p, [0, 1], [1.04, 1.0]);
      wrapperStyle.transform = `scale(${scale})`;
      wrapperStyle.opacity = interpolate(p, [0, 0.4], [0.65, 1], {
        extrapolateRight: 'clamp',
      });
      break;
    }
  }

  return (
    <div style={wrapperStyle}>
      {children}
      {overlayElement}
    </div>
  );
};
