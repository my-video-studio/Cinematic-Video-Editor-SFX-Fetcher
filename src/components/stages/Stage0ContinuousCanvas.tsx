import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { resolveAssetStaticPath } from '../../utils/assetResolver';
import {
  BG_OPTICAL_DOF_FILTER,
  UNIVERSAL_COLD_GRADE_FILTER,
  UNIVERSAL_VIGNETTE_STYLE,
  getFilmGrainOverlayStyle,
} from '../../utils/colorGrading';
import { CutoutImg } from '../common/CutoutImg';
import { WeatherParticleCanvas } from '../particles/WeatherParticleCanvas';

/**
 * STAGE_0_WAR_COMPOSITE_MASTER
 * Autonomous 16:9 multiplane composite engine for Opening Hook sequences
 * (available for full-video Part 1/Master builds; Part 3 begins directly in Phase B).
 */
export const Stage0ContinuousCanvas: React.FC = () => {
  const frame = useCurrentFrame();

  const camScale = interpolate(
    frame,
    [0, 480, 580, 917, 1366, 1583],
    [1.18, 1.14, 0.42, 1.05, 1.35, 2.4],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    }
  );
  const camPanX = interpolate(
    frame,
    [0, 480, 625, 917, 1366, 1583],
    [0, 30, -80, -420, -180, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const camPanY = interpolate(
    frame,
    [0, 480, 917, 1366, 1583],
    [0, -25, -50, 120, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const camRotate = interpolate(frame, [480, 580, 917], [0, -3.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090a0d',
        overflow: 'hidden',
        filter: UNIVERSAL_COLD_GRADE_FILTER,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${camScale}) translate3d(${camPanX}px, ${camPanY}px, 0px) rotate(${camRotate}deg)`,
        }}
      >
        {/* zIndex 1: Snowy Approach Plate */}
        <Img
          src={resolveAssetStaticPath('bg_snowy_no_mans_land_approach_dawn')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: BG_OPTICAL_DOF_FILTER,
            zIndex: 1,
          }}
        />

        {/* zIndex 2: Back Fog Mist */}
        <WeatherParticleCanvas type="fog_mist" intensity={0.8} zIndex={2} />

        {/* zIndex 4: Tactical Map & Surrender Note */}
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 240,
            width: 520,
            height: 360,
            boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
            border: '10px solid #f6f4ee',
            zIndex: 4,
          }}
        >
          <Img
            src={resolveAssetStaticPath('real_map_bastogne_tactical')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* zIndex 5: Foreground Sandbags & Sentries */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <CutoutImg
            assetId="cutout_fg_sandbags_sentries"
            requiresBackgroundRemoval={true}
            extraFilter="blur(3px)"
            objectFit="cover"
          />
        </div>

        {/* zIndex 6: General McAuliffe Waist-Up Cutout */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: 680,
            height: 820,
            transform: 'translateX(-50%)',
            zIndex: 6,
          }}
        >
          <CutoutImg
            assetId="real_mcauliffe_portrait"
            requiresBackgroundRemoval={true}
            featherBottom={true}
            objectFit="contain"
          />
        </div>

        {/* zIndex 7: Foreground Blizzard Snow */}
        <WeatherParticleCanvas
          type="snow"
          intensity={1.4}
          windSpeed={-3.5}
          zIndex={7}
        />
      </div>

      <div style={getFilmGrainOverlayStyle(frame)} />
      <div style={UNIVERSAL_VIGNETTE_STYLE} />
    </AbsoluteFill>
  );
};
