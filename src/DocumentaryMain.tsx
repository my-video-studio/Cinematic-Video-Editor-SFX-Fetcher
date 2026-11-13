import React from 'react';
import { AbsoluteFill, Audio, Series } from 'remotion';
import storyboardRaw from '../public/assets/aistudio/storyboard_part3_978c475c.json';
import type { StoryboardData, StoryboardScene } from './types/storyboard';
import { resolveVoiceoverStaticPath } from './utils/assetResolver';
import { SceneTransitionWrapper } from './components/common/SceneTransitionWrapper';
import { SubtitleOverlay } from './components/common/SubtitleOverlay';
import { Stage0ContinuousCanvas } from './components/stages/Stage0ContinuousCanvas';
import { StageFullBleedVintage } from './components/stages/StageFullBleedVintage';
import { StageArchivalBoard } from './components/stages/StageArchivalBoard';
import { StageCanvasMontage } from './components/stages/StageCanvasMontage';
import { Stage4ParallaxCutout } from './components/stages/Stage4ParallaxCutout';

const storyboard = storyboardRaw as unknown as StoryboardData;

const SceneStageRouter: React.FC<{ scene: StoryboardScene }> = ({ scene }) => {
  switch (scene.stageType) {
    case 'STAGE_1_FULL_BLEED_VINTAGE':
      return <StageFullBleedVintage scene={scene} />;
    case 'STAGE_2_ARCHIVAL_BOARD':
      return <StageArchivalBoard scene={scene} />;
    case 'STAGE_3_CANVAS_MONTAGE':
      return <StageCanvasMontage scene={scene} />;
    case 'STAGE_4_PARALLAX_CUTOUT':
    default:
      return <Stage4ParallaxCutout scene={scene} />;
  }
};

export const DocumentaryMain: React.FC = () => {
  const voiceoverSrc = resolveVoiceoverStaticPath();
  const hasHook = storyboard.projectMeta.hookEndFrame > 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090a0d',
        overflow: 'hidden',
      }}
    >
      {/* Voiceover-Only Master Audio Track */}
      <Audio src={voiceoverSrc} />

      <Series>
        {hasHook && (
          <Series.Sequence
            key="stage_0_hook"
            durationInFrames={storyboard.projectMeta.hookEndFrame}
          >
            <Stage0ContinuousCanvas />
          </Series.Sequence>
        )}

        {storyboard.scenes.map((scene) => (
          <Series.Sequence
            key={scene.sceneId}
            durationInFrames={scene.durationInFrames}
          >
            <SceneTransitionWrapper
              transitionIn={scene.transitionIn}
              durationInFrames={scene.durationInFrames}
            >
              <SceneStageRouter scene={scene} />
            </SceneTransitionWrapper>
          </Series.Sequence>
        ))}
      </Series>

      <SubtitleOverlay />
    </AbsoluteFill>
  );
};
