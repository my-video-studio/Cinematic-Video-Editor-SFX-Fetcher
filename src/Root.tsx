import React from 'react';
import { Composition } from 'remotion';
import storyboardRaw from '../public/assets/aistudio/storyboard_part3_978c475c.json';
import type { StoryboardData } from './types/storyboard';
import { DocumentaryMain } from './DocumentaryMain';

const storyboard = storyboardRaw as unknown as StoryboardData;

export const RemotionRoot: React.FC = () => {
  const { fps, width, height, durationInFrames } = storyboard.projectMeta;

  return (
    <Composition
      id="HistoricalDocumentary"
      component={DocumentaryMain}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
  );
};
