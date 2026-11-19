import React, { useId } from 'react';
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
  resolveAssetStaticPath,
  hasWhiteBackgroundCutout,
} from '../../utils/assetResolver';
import {
  BG_OPTICAL_DOF_FILTER,
  UNIVERSAL_COLD_GRADE_FILTER,
  UNIVERSAL_VIGNETTE_STYLE,
  getFilmGrainOverlayStyle,
} from '../../utils/colorGrading';
import { CutoutImg } from '../common/CutoutImg';
import { WeatherParticleCanvas } from '../particles/WeatherParticleCanvas';
import { MicroActionOverlay } from '../common/MicroActionOverlay';

export interface Stage4ParallaxCutoutProps {
  scene: StoryboardScene;
}

export const Stage4ParallaxCutout: React.FC<Stage4ParallaxCutoutProps> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maskId = useId().replace(/:/g, '_');

  const variant = scene.parallaxVariant || 'STANDARD_2_5D_PARALLAX';

  // =========================================================================
  // VARIANT D: BRUSH_TITLE_TO_NEWSPAPER_CUTOUT
  // =========================================================================
  if (variant === 'BRUSH_TITLE_TO_NEWSPAPER_CUTOUT') {
    const banner = scene.brushBanner;
    const unfold = scene.newspaperUnfold;
    const hero = scene.heroSpring;

    const bannerTriggerRel = Math.max(
      0,
      (banner?.triggerFrame ?? scene.startFrame + 15) - scene.startFrame
    );
    const unfoldTriggerRel = Math.max(
      12,
      (unfold?.triggerFrame ?? scene.startFrame + 60) - scene.startFrame
    );
    const heroTriggerRel = Math.max(
      8,
      (hero?.triggerFrame ?? scene.startFrame + 24) - scene.startFrame
    );

    const wipePct = interpolate(
      frame,
      [Math.max(0, bannerTriggerRel - 12), bannerTriggerRel + 16],
      [0, 100],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      }
    );

    const unfoldSpring = spring({
      frame: Math.max(0, frame - (unfoldTriggerRel - 8)),
      fps,
      config: { damping: 14, stiffness: 120, mass: 0.9 },
    });
    const rotateX = interpolate(unfoldSpring, [0, 1], [-75, 0]);
    const unfoldOpacity = frame >= unfoldTriggerRel - 8 ? Math.min(1, unfoldSpring * 1.4) : 0;

    const heroSpringVal = spring({
      frame: Math.max(0, frame - (heroTriggerRel - 5)),
      fps,
      config: { damping: 14, stiffness: 150, mass: 0.85 },
    });
    const heroTranslateY =
      frame >= heroTriggerRel - 5 ? interpolate(heroSpringVal, [0, 1], [420, 0]) : 420;
    const heroOpacity = frame >= heroTriggerRel - 5 ? Math.min(1, heroSpringVal * 1.4) : 0;

    const bgBlur = frame >= unfoldTriggerRel + 10 ? 2 : 0;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: '#0c0d10',
          overflow: 'hidden',
          filter: UNIVERSAL_COLD_GRADE_FILTER,
        }}
      >
        {/* Subtle dark archival texture */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 50% 45%, #1d2129 0%, #0d0e12 75%)',
          }}
        />

        {/* Animated Crimson Brushstroke Banner */}
        {banner && (
          <div
            style={{
              position: 'absolute',
              top: 110,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: 'relative',
                paddingTop: 18,
                paddingBottom: 18,
                paddingLeft: 56,
                paddingRight: 56,
                backgroundColor: banner.color || '#B3122A',
                clipPath: `inset(0 ${100 - wipePct}% 0 0)`,
                boxShadow: '0 16px 38px rgba(0,0,0,0.65)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Cinzel", "Oswald", Georgia, serif',
                  fontSize: 60,
                  fontWeight: 700,
                  letterSpacing: 8,
                  fontVariantNumeric: 'lining-nums tabular-nums',
                  color: '#f6f4ee',
                  textTransform: 'uppercase',
                }}
              >
                {banner.text}
              </span>
            </div>
          </div>
        )}

        {/* 3D Vertical Unfold Document / Newspaper */}
        {unfold && (
          <div
            style={{
              position: 'absolute',
              right: 110,
              top: 235,
              width: 670,
              height: 510,
              perspective: 1200,
              zIndex: 3,
              opacity: unfoldOpacity,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `rotateX(${rotateX}deg) rotateZ(1.5deg)`,
                transformOrigin: 'top center',
                border: '14px solid #f6f4ee',
                boxShadow: '0 26px 54px rgba(0,0,0,0.75)',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
              }}
            >
              <Img
                src={resolveAssetStaticPath(unfold.assetId)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        )}

        {/* Back fog layer */}
        <WeatherParticleCanvas type="fog_mist" intensity={0.6} zIndex={4} />

        {/* Waist-up Hero Portrait Cutout springing from bottom */}
        {hero && (
          <div
            style={{
              position: 'absolute',
              left: 150,
              bottom: hasWhiteBackgroundCutout(hero.assetId) ? 0 : 155,
              width: hasWhiteBackgroundCutout(hero.assetId) ? 740 : 500,
              height: hasWhiteBackgroundCutout(hero.assetId) ? 820 : 620,
              transform: `translateY(${heroTranslateY}px)`,
              opacity: heroOpacity,
              zIndex: 5,
            }}
          >
            <CutoutImg
              assetId={hero.assetId}
              featherBottom={true}
              objectFit="contain"
            />
          </div>
        )}

        <WeatherParticleCanvas
          type="dust"
          intensity={0.75}
          windSpeed={-1.2}
          zIndex={7}
        />
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
  }

  // =========================================================================
  // VARIANT C: MIRROR_PORTAL_HUD_ROOM
  // =========================================================================
  if (variant === 'MIRROR_PORTAL_HUD_ROOM') {
    const bgAssetId = scene.bgAssetId || 'bg_dim_command_post_interior';
    const reflectionAssetId =
      scene.mirrorPortal?.reflectionAssetId || 'real_mcauliffe_portrait';
    const fgAssetId =
      scene.foregroundSilhouetteAssetId || 'cutout_fg_doorframe_lamp_silhouette';
    const isCracked = scene.mirrorPortal?.frame?.includes('cracked');

    const pullScale = interpolate(frame, [0, scene.durationInFrames], [1.22, 1.0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });

    const reflectionRel = Math.max(
      0,
      (scene.mirrorPortal?.triggerFrame ?? scene.startFrame) - scene.startFrame
    );
    const reflectionEnter = spring({
      frame: Math.max(0, frame - Math.max(0, reflectionRel - 5)),
      fps,
      config: { damping: 16, stiffness: 130 },
    });

    const glowPulse = 0.45 + 0.35 * Math.sin(frame * 0.12);

    return (
      <AbsoluteFill
        style={{
          backgroundColor: '#090b0f',
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
            transform: `scale(${pullScale})`,
          }}
        >
          {/* Layer 1: Background Plate with Optical DOF */}
          <Img
            src={resolveAssetStaticPath(bgAssetId)}
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

          {/* Layer 2: Back Fog */}
          <WeatherParticleCanvas type="fog_mist" intensity={0.7} zIndex={2} />

          {/* Layer 3: Hollow-Center Mirror Frame + Reflection Cutout */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 620,
              height: 780,
              transform: 'translate(-50%, -52%)',
              zIndex: 3,
              border: '14px solid #8a7347',
              boxShadow: `0 0 ${32 + glowPulse * 24}px rgba(135, 206, 250, ${glowPulse * 0.45}), 0 28px 60px rgba(0,0,0,0.85)`,
              backgroundColor: 'rgba(12, 18, 24, 0.78)',
              overflow: 'hidden',
            }}
          >
            {/* Reflection inside mirror */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '92%',
                opacity: reflectionEnter,
                transform: `scale(${0.96 + reflectionEnter * 0.04})`,
              }}
            >
              <CutoutImg
                assetId={reflectionAssetId}
                featherBottom={true}
                noArchivalBorder={true}
                objectFit="contain"
              />
            </div>

            {/* Glass reflection & optional crack lines */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 620 780"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
            >
              <polygon
                points="0,0 240,0 80,780 0,780"
                fill="rgba(255,255,255,0.06)"
              />
              {isCracked && (
                <path
                  d="M 480 120 L 390 260 L 420 340 L 290 480 M 390 260 L 520 310"
                  fill="none"
                  stroke="rgba(220,240,255,0.5)"
                  strokeWidth="2.5"
                />
              )}
            </svg>
          </div>

          {/* Layer 4: Foreground Silhouette Occlusion */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: 'scale(1.18)',
              filter: 'blur(6px)',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          >
            <CutoutImg
              assetId={fgAssetId}
              requiresBackgroundRemoval={true}
              objectFit="cover"
            />
          </div>
        </div>

        <WeatherParticleCanvas
          type="dust"
          intensity={0.9}
          windSpeed={-1.5}
          zIndex={7}
        />
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
  }

  // =========================================================================
  // VARIANT B: MULTI_NODE_3D_AUDITORIUM_RIG (10-Node Persistent World Rig)
  // =========================================================================
  if (variant === 'MULTI_NODE_3D_AUDITORIUM_RIG') {
    const bgAssetId = scene.bgAssetId || 'bg_bastogne_night_bombing_glow';
    const heroAssetId = scene.heroCutoutAssetId || 'real_renee_lemaire_cutout';
    const propAssetId = scene.propCutoutAssetId;
    const nodes = scene.rigNodes || [];

    const absFrame = scene.startFrame + frame;
    const progress = interpolate(frame, [0, scene.durationInFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    // Multi-null continuous 3D camera path across the 10 nodes with zero dead stops
    const camScale = interpolate(
      progress,
      [0, 0.25, 0.5, 0.75, 1.0],
      [1.0, 1.09, 1.16, 1.12, 1.06],
      { easing: Easing.bezier(0.25, 0.1, 0.25, 1.0) }
    );
    const camPanX = interpolate(
      progress,
      [0, 0.3, 0.55, 0.8, 1.0],
      [0, -45, 70, -35, 0],
      { easing: Easing.bezier(0.25, 0.1, 0.25, 1.0) }
    );
    const camPanY = interpolate(
      progress,
      [0, 0.35, 0.65, 1.0],
      [0, -18, 14, 0],
      { easing: Easing.bezier(0.25, 0.1, 0.25, 1.0) }
    );
    const camRot = interpolate(progress, [0, 0.4, 0.75, 1.0], [0, -1.2, 0.8, 0]);

    // Determine mount frame for hero & prop from rigNodes (persistent once mounted!)
    const heroNode = nodes.find((n) => n.assetId === heroAssetId);
    const heroMountAbs = heroNode ? heroNode.startFrame - 5 : scene.startFrame + 60;
    const heroMounted = absFrame >= heroMountAbs;
    const heroSpringVal = spring({
      frame: Math.max(0, absFrame - heroMountAbs),
      fps,
      config: { damping: 15, stiffness: 135 },
    });

    const propNode = propAssetId
      ? nodes.find((n) => n.assetId === propAssetId)
      : undefined;
    const propMountAbs = propNode
      ? propNode.startFrame - 5
      : scene.startFrame + 160;
    const propMounted = Boolean(propAssetId && absFrame >= propMountAbs);
    const propSpringVal = spring({
      frame: Math.max(0, absFrame - propMountAbs),
      fps,
      config: { damping: 14, stiffness: 155 },
    });

    // Direct hit flash on node 3 if bombing scene
    const hitNode = nodes.find((n) => n.nodeRole === 'direct_hit_flash');
    const hitFlashOpacity =
      hitNode && absFrame >= hitNode.startFrame && absFrame <= hitNode.startFrame + 18
        ? interpolate(
            absFrame - hitNode.startFrame,
            [0, 4, 18],
            [0.65, 0.25, 0],
            { extrapolateRight: 'clamp' }
          )
        : 0;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: '#090a0d',
          overflow: 'hidden',
          filter: UNIVERSAL_COLD_GRADE_FILTER,
        }}
      >
        {/* Single persistent 3D world rig wrapper */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `translate3d(${camPanX}px, ${camPanY}px, 0px) scale(${camScale}) rotateZ(${camRot}deg)`,
          }}
        >
          {/* zIndex 1: Background Plate with Optical DOF */}
          <Img
            src={resolveAssetStaticPath(bgAssetId)}
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

          {/* zIndex 2: Back Fog Layer */}
          <WeatherParticleCanvas
            type="fog_mist"
            intensity={0.85}
            windSpeed={-1.8}
            zIndex={2}
          />

          {/* zIndex 3: Persistent Hero Cutout (remains mounted in world!) */}
          {heroMounted && (() => {
            const isWhiteCutout = hasWhiteBackgroundCutout(heroAssetId);
            const shiftP = propAssetId
              ? interpolate(absFrame, [propMountAbs, propMountAbs + 18], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.cubic),
                })
              : 0;
            const heroLeftPct = interpolate(shiftP, [0, 1], [50, 25]);
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${heroLeftPct}%`,
                  bottom: isWhiteCutout ? 0 : 160,
                  width: isWhiteCutout ? 680 : propMounted ? 450 : 485,
                  height: isWhiteCutout ? 820 : propMounted ? 580 : 615,
                  transform: `translateX(-50%) translateY(${(1 - heroSpringVal) * 140}px)`,
                  opacity: Math.min(1, heroSpringVal * 1.4),
                  zIndex: 3,
                }}
              >
                <CutoutImg
                  assetId={heroAssetId}
                  featherBottom={true}
                  objectFit="contain"
                />
              </div>
            );
          })()}

          {/* zIndex 4: Persistent Prop Cutout (e.g. Cobra King Sherman) */}
          {propMounted && propAssetId && (
            <div
              style={{
                position: 'absolute',
                right: 76,
                bottom: 160,
                width: 720,
                height: 510,
                transform: `translateX(${(1 - propSpringVal) * 260}px) scale(${
                  0.94 + propSpringVal * 0.06
                })`,
                opacity: Math.min(1, propSpringVal * 1.4),
                zIndex: 4,
                filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.8))',
              }}
            >
              <CutoutImg
                assetId={propAssetId}
                requiresBackgroundRemoval={true}
                objectFit="contain"
              />
            </div>
          )}

          {/* zIndex 6: Direct Hit Explosion Glow if applicable */}
          {hitFlashOpacity > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'radial-gradient(circle at 60% 55%, rgba(255, 190, 90, 0.95) 0%, rgba(220, 65, 20, 0.45) 45%, rgba(0,0,0,0) 75%)',
                opacity: hitFlashOpacity,
                zIndex: 6,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* zIndex 7: Front Atmospheric Pass (embers for bombing, snow/dust otherwise) */}
        <WeatherParticleCanvas
          type={scene.sceneId === 'scene_30' ? 'embers' : 'snow'}
          intensity={1.15}
          windSpeed={-2.5}
          zIndex={7}
        />

        <div style={getFilmGrainOverlayStyle(frame)} />
        <div style={UNIVERSAL_VIGNETTE_STYLE} />

        {/* Subtle Rough Brush SVG Mask Vignette Frame Accent */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
            </mask>
          </defs>
        </svg>

        <MicroActionOverlay
          sceneId={scene.sceneId}
          microActions={scene.microActions}
          sceneStartFrame={scene.startFrame}
          sequenceDurationInFrames={scene.durationInFrames}
        />
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // VARIANT A: STANDARD_2_5D_PARALLAX (Default)
  // =========================================================================
  const layers = scene.layers || [];
  const bgLayer = layers.find((l) => l.layerRole === 'background_plate');
  const heroLayer = layers.find((l) => l.layerRole === 'midground_hero_cutout');
  const fgLayer = layers.find((l) => l.layerRole === 'foreground_flank_silhouette');

  const bgAssetId = bgLayer?.assetId || scene.bgAssetId || 'bg_dim_command_post_interior';
  const heroAssetId = heroLayer?.assetId || scene.heroCutoutAssetId;
  const fgAssetId = fgLayer?.assetId;

  const camStart = scene.cameraPush?.startScale ?? 1.0;
  const camEnd = scene.cameraPush?.endScale ?? 1.14;

  const bgScale = interpolate(
    frame,
    [0, scene.durationInFrames],
    [camStart, camStart + (camEnd - camStart) * 0.3],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    }
  );

  const heroScale = interpolate(
    frame,
    [0, scene.durationInFrames],
    [camStart * 1.02, camEnd],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    }
  );

  const fgScale = interpolate(
    frame,
    [0, scene.durationInFrames],
    [1.06, 1.24],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    }
  );

  const heroMountRel = Math.max(
    0,
    (heroLayer?.mountFrame ?? scene.startFrame) - scene.startFrame
  );
  const heroVisible = frame >= heroMountRel;
  const heroEnter = spring({
    frame: Math.max(0, frame - heroMountRel),
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  const fgMountRel = Math.max(
    0,
    (fgLayer?.mountFrame ?? scene.startFrame) - scene.startFrame
  );
  const fgVisible = Boolean(fgAssetId && frame >= fgMountRel);
  const fgEnter = interpolate(frame - fgMountRel, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const hasSnowWeather =
    bgLayer?.weatherEffect === 'snow_mist' ||
    bgAssetId.includes('snow') ||
    bgAssetId.includes('christmas') ||
    bgAssetId.includes('outpost');

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090b0f',
        overflow: 'hidden',
        filter: UNIVERSAL_COLD_GRADE_FILTER,
      }}
    >
      {/* zIndex 1: Background Plate with 2.5px Optical DOF */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${bgScale})`,
          zIndex: 1,
        }}
      >
        <Img
          src={resolveAssetStaticPath(bgAssetId)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: BG_OPTICAL_DOF_FILTER,
          }}
        />
      </div>

      {/* zIndex 2: Atmospheric Fog Layer BEHIND Hero */}
      <WeatherParticleCanvas
        type="fog_mist"
        intensity={hasSnowWeather ? 0.85 : 0.55}
        windSpeed={-1.4}
        zIndex={2}
      />

      {/* zIndex 3: Crisp Waist-Up Hero Cutout anchored cleanly */}
      {heroAssetId && heroVisible && (() => {
        const isWhiteCutout = hasWhiteBackgroundCutout(heroAssetId);
        const rawOffset = heroLayer?.position?.bottomOffsetPx;
        const resolvedBottom = isWhiteCutout
          ? rawOffset ?? 0
          : rawOffset && rawOffset > 0
          ? rawOffset
          : 155;
        return (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: resolvedBottom,
              width: isWhiteCutout ? 720 : 500,
              height: isWhiteCutout ? 860 : 625,
              transform: `translateX(-50%) scale(${
                heroScale * (0.96 + heroEnter * 0.04)
              })`,
              transformOrigin: 'bottom center',
              opacity: heroEnter,
              zIndex: 3,
            }}
          >
            <CutoutImg
              assetId={heroAssetId}
              featherBottom={true}
              objectFit="contain"
            />
          </div>
        );
      })()}

      {/* zIndex 5: Foreground Flank Silhouette with Shallow Optical Edge Blur */}
      {fgAssetId && fgVisible && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${fgScale})`,
            opacity: fgEnter,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <CutoutImg
            assetId={fgAssetId}
            requiresBackgroundRemoval={true}
            extraFilter={fgLayer?.lensOcclusion?.filter || 'blur(6px)'}
            objectFit="cover"
          />
        </div>
      )}

      {/* zIndex 7: Foreground Weather Particles OVER Hero & Sentries */}
      <WeatherParticleCanvas
        type={hasSnowWeather ? 'snow' : 'dust'}
        intensity={hasSnowWeather ? 1.35 : 0.7}
        windSpeed={hasSnowWeather ? -3.4 : -0.8}
        zIndex={7}
      />

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
