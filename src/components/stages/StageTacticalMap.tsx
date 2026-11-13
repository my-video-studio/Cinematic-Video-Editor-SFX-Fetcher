import React from 'react';
import { Img, useCurrentFrame, interpolate, Easing } from 'remotion';
import { resolveAssetStaticPath } from '../../utils/assetResolver';
import { ARCHIVAL_COLD_GRADE_FILTER } from '../../utils/colorGrading';

export interface StageTacticalMapProps {
  assetId: string;
  durationInFrames: number;
  showRouteArrows?: boolean;
  radarCoords?: Array<{ x: number; y: number; label?: string }>;
}

export const StageTacticalMap: React.FC<StageTacticalMapProps> = ({
  assetId,
  durationInFrames,
  showRouteArrows = true,
  radarCoords = [
    { x: 960, y: 540, label: 'BASTOGNE PERIMETER' },
    { x: 740, y: 515, label: 'WEST SECTOR' },
  ],
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.07], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  });

  const arrowDash = interpolate(frame, [6, 36], [420, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Img
        src={resolveAssetStaticPath(assetId)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: `scale(${scale})`,
          filter: ARCHIVAL_COLD_GRADE_FILTER,
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Concentric tactical radar pulses */}
        {radarCoords.map((pt, idx) => {
          const cycle = ((frame + idx * 18) % 45) / 45;
          const r = 18 + cycle * 95;
          const opacity = 1 - cycle;
          return (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={r}
                fill="none"
                stroke="#d4202a"
                strokeWidth="3"
                opacity={opacity * 0.8}
              />
              <circle cx={pt.x} cy={pt.y} r="7" fill="#d4202a" />
            </g>
          );
        })}

        {/* Animated SVG tactical route arc */}
        {showRouteArrows && (
          <path
            d="M 1180 650 Q 980 560 760 520"
            fill="none"
            stroke="#c91b2e"
            strokeWidth="6"
            strokeDasharray="420"
            strokeDashoffset={arrowDash}
            strokeLinecap="round"
            opacity="0.88"
          />
        )}
      </svg>
    </div>
  );
};
