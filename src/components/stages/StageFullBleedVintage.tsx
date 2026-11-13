import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import type { StoryboardScene } from '../../types/storyboard';
import { resolveAssetStaticPath } from '../../utils/assetResolver';
import {
  VINTAGE_SEPIA_GRADE_FILTER,
  UNIVERSAL_COLD_GRADE_FILTER,
  UNIVERSAL_VIGNETTE_STYLE,
  getFilmGrainOverlayStyle,
} from '../../utils/colorGrading';
import { WeatherParticleCanvas } from '../particles/WeatherParticleCanvas';
import { MicroActionOverlay } from '../common/MicroActionOverlay';

export interface StageFullBleedVintageProps {
  scene: StoryboardScene;
}

export const StageFullBleedVintage: React.FC<StageFullBleedVintageProps> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const assetId = scene.assetId || 'bg_operations_room_map_table_dim';
  const startScale = scene.treatment?.cameraDrift?.startScale ?? 1.0;
  const endScale = scene.treatment?.cameraDrift?.endScale ?? 1.04;

  const scale = interpolate(
    frame,
    [0, scene.durationInFrames],
    [startScale, endScale],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    }
  );

  const panX = interpolate(frame, [0, scene.durationInFrames], [-10, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  });

  const isOutdoorSnow =
    assetId.includes('snow') ||
    assetId.includes('outpost') ||
    assetId.includes('bastogne_outskirts');

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b0c10',
        overflow: 'hidden',
        filter: isOutdoorSnow
          ? UNIVERSAL_COLD_GRADE_FILTER
          : VINTAGE_SEPIA_GRADE_FILTER,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translate3d(${panX}px, 0px, 0px)`,
        }}
      >
        <Img
          src={resolveAssetStaticPath(assetId)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {isOutdoorSnow && (
        <>
          <WeatherParticleCanvas
            type="fog_mist"
            intensity={0.7}
            windSpeed={-1.5}
            zIndex={4}
          />
          <WeatherParticleCanvas
            type="snow"
            intensity={1.1}
            windSpeed={-2.8}
            zIndex={7}
          />
        </>
      )}

      {!isOutdoorSnow && (
        <WeatherParticleCanvas
          type="dust"
          intensity={0.7}
          windSpeed={0.8}
          zIndex={4}
        />
      )}

      <div style={getFilmGrainOverlayStyle(frame)} />
      <div style={UNIVERSAL_VIGNETTE_STYLE} />

      <MicroActionOverlay
        microActions={scene.microActions}
        sceneStartFrame={scene.startFrame}
      />
    </AbsoluteFill>
  );
};
