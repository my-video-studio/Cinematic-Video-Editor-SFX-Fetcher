import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import type { StoryboardScene } from '../../types/storyboard';
import { getAssetEntry, resolveAssetStaticPath } from '../../utils/assetResolver';
import {
  ARCHIVAL_COLD_GRADE_FILTER,
  UNIVERSAL_VIGNETTE_STYLE,
  getFilmGrainOverlayStyle,
} from '../../utils/colorGrading';
import { MicroActionOverlay } from '../common/MicroActionOverlay';
import { StageTacticalMap } from './StageTacticalMap';

export interface StageArchivalBoardProps {
  scene: StoryboardScene;
}

export const StageArchivalBoard: React.FC<StageArchivalBoardProps> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const assetId = scene.mountedCardAssetId || 'real_sla_marshall_portrait';
  const entry = getAssetEntry(assetId);
  const aspectRatio = entry?.aspectRatio || '4:3';
  const surface = scene.board?.surface || 'dark_wood';
  const tiltDeg = scene.board?.tiltDeg ?? -1.0;

  // Continuous momentum baseline drift + word-triggered inspectionZoom
  const baseScale = interpolate(
    frame,
    [0, scene.durationInFrames],
    [1.0, 1.035],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    }
  );

  let zoomBoost = 0;
  if (scene.inspectionZoom) {
    const relZoomStart = Math.max(
      0,
      scene.inspectionZoom.triggerFrame - scene.startFrame
    );
    const targetDelta = (scene.inspectionZoom.scale || 1.12) - 1.0;
    zoomBoost = interpolate(
      frame,
      [relZoomStart, Math.min(scene.durationInFrames, relZoomStart + 36)],
      [0, targetDelta],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      }
    );
  }

  const totalScale = baseScale + zoomBoost;

  // Determine frame dimensions keeping uncropped 4:3, 3:4, 1:1, or 16:9 aspect
  let cardWidth = 920;
  let cardHeight = 690;
  if (aspectRatio === '1:1') {
    cardWidth = 720;
    cardHeight = 720;
  } else if (aspectRatio === '3:4') {
    cardWidth = 570;
    cardHeight = 760;
  } else if (aspectRatio === '16:9') {
    cardWidth = 1140;
    cardHeight = 642;
  }

  const surfaceBg =
    surface === 'dark_wood'
      ? 'radial-gradient(circle at 50% 45%, #2b2119 0%, #17120e 58%, #0b0907 100%)'
      : 'radial-gradient(circle at 50% 45%, #222831 0%, #14181e 58%, #090b0e 100%)';

  const isTacticalMap =
    entry?.zLayerRole === 'tactical_map_surface' ||
    assetId.includes('map_bastogne');

  return (
    <AbsoluteFill
      style={{
        background: surfaceBg,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle desk surface grain lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.14,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 28px)',
          pointerEvents: 'none',
        }}
      />

      {/* Mounted uncropped archival photo card */}
      <div
        style={{
          position: 'relative',
          width: cardWidth,
          height: cardHeight,
          border: scene.board?.border || '16px solid #f6f4ee',
          backgroundColor: '#121212',
          boxShadow:
            scene.board?.dropShadow || '0 24px 48px rgba(0, 0, 0, 0.55)',
          transform: `rotate(${tiltDeg}deg) scale(${totalScale})`,
          overflow: 'hidden',
        }}
      >
        {isTacticalMap ? (
          <StageTacticalMap
            assetId={assetId}
            durationInFrames={scene.durationInFrames}
          />
        ) : (
          <Img
            src={resolveAssetStaticPath(assetId)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: ARCHIVAL_COLD_GRADE_FILTER,
            }}
          />
        )}
      </div>

      <div style={getFilmGrainOverlayStyle(frame)} />
      <div style={UNIVERSAL_VIGNETTE_STYLE} />

      <MicroActionOverlay
        sceneId={scene.sceneId}
        microActions={scene.microActions}
        sceneStartFrame={scene.startFrame}
        sequenceDurationInFrames={scene.durationInFrames}
      />
    </AbsoluteFill>
  );
};
