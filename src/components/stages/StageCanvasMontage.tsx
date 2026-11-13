import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import type { StoryboardScene } from '../../types/storyboard';
import {
  getAssetEntry,
  isCutoutAsset,
  resolveAssetStaticPath,
} from '../../utils/assetResolver';
import {
  ARCHIVAL_COLD_GRADE_FILTER,
  UNIVERSAL_VIGNETTE_STYLE,
  getFilmGrainOverlayStyle,
} from '../../utils/colorGrading';
import { CutoutImg } from '../common/CutoutImg';
import { MicroActionOverlay } from '../common/MicroActionOverlay';

export interface StageCanvasMontageProps {
  scene: StoryboardScene;
}

function getSlotLayout(
  slot: string,
  totalItems: number
): { leftPct: number; topPct: number; maxW: number; maxH: number } {
  if (totalItems === 2) {
    if (slot === 'left') {
      return { leftPct: 29, topPct: 48, maxW: 640, maxH: 520 };
    }
    return { leftPct: 71, topPct: 48, maxW: 640, maxH: 520 };
  }
  if (totalItems === 3) {
    if (slot === 'left') {
      return { leftPct: 21, topPct: 49, maxW: 510, maxH: 450 };
    }
    if (slot === 'center') {
      return { leftPct: 50, topPct: 45, maxW: 510, maxH: 470 };
    }
    return { leftPct: 79, topPct: 49, maxW: 510, maxH: 450 };
  }
  // 4 items
  switch (slot) {
    case 'far_left':
      return { leftPct: 15, topPct: 49, maxW: 410, maxH: 390 };
    case 'left':
      return { leftPct: 38.5, topPct: 45, maxW: 420, maxH: 390 };
    case 'right':
      return { leftPct: 61.5, topPct: 49, maxW: 420, maxH: 390 };
    case 'far_right':
    default:
      return { leftPct: 85, topPct: 45, maxW: 410, maxH: 390 };
  }
}

export const StageCanvasMontage: React.FC<StageCanvasMontageProps> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = scene.montage?.items || [];
  const canvasColor = scene.montage?.canvasColor || '#141414';

  const boardDrift = interpolate(
    frame,
    [0, scene.durationInFrames],
    [1.0, 1.035],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasColor,
        backgroundImage:
          'radial-gradient(circle at 50% 45%, #222428 0%, #141414 68%, #0a0a0c 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${boardDrift})`,
        }}
      >
        {items.map((item, idx) => {
          const relMount = Math.max(0, item.mountFrame - scene.startFrame);
          const f = frame - relMount;
          if (f < 0) return null;

          const pop = spring({
            frame: f,
            fps,
            config: { damping: 14, stiffness: 165, mass: 0.85 },
          });

          const entryScale = interpolate(pop, [0, 1], [1.06, 1.0]);
          const opacity = interpolate(f, [0, 7], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const layout = getSlotLayout(item.position.slot, items.length);
          const entry = getAssetEntry(item.assetId);
          const ar = item.aspectRatio || entry?.aspectRatio || '4:3';

          let boxW = layout.maxW;
          let boxH = Math.round(boxW * 0.75);
          if (ar === '1:1') {
            boxW = Math.min(layout.maxW, layout.maxH);
            boxH = boxW;
          } else if (ar === '3:4') {
            boxH = layout.maxH;
            boxW = Math.round(boxH * 0.75);
          } else if (ar === '16:9') {
            boxW = layout.maxW;
            boxH = Math.round((boxW * 9) / 16);
          }

          const cutout = isCutoutAsset(item.assetId);

          return (
            <div
              key={`${item.assetId}-${idx}`}
              style={{
                position: 'absolute',
                left: `${layout.leftPct}%`,
                top: `${layout.topPct}%`,
                width: boxW,
                height: boxH,
                transform: `translate(-50%, -50%) rotate(${item.position.tiltDeg}deg) scale(${entryScale})`,
                opacity,
                border: '12px solid #f6f4ee',
                backgroundColor: '#1b1d21',
                boxShadow: '0 22px 46px rgba(0, 0, 0, 0.72)',
                overflow: 'hidden',
                zIndex: 10 + idx,
              }}
            >
              {cutout ? (
                <CutoutImg
                  assetId={item.assetId}
                  objectFit="cover"
                  extraFilter={ARCHIVAL_COLD_GRADE_FILTER}
                />
              ) : (
                <Img
                  src={resolveAssetStaticPath(item.assetId)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: ARCHIVAL_COLD_GRADE_FILTER,
                  }}
                />
              )}

              {entry?.attribution && (
                <div
                  style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    backgroundColor: 'rgba(10, 12, 16, 0.76)',
                    paddingTop: 3,
                    paddingBottom: 3,
                    paddingLeft: 8,
                    paddingRight: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: 11,
                      color: '#f6f4ee',
                      letterSpacing: 1.1,
                    }}
                  >
                    {entry.attribution}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={getFilmGrainOverlayStyle(frame)} />
      <div style={UNIVERSAL_VIGNETTE_STYLE} />

      <MicroActionOverlay
        microActions={scene.microActions}
        sceneStartFrame={scene.startFrame}
      />
    </AbsoluteFill>
  );
};
