import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Player, type CallbackListener, type PlayerRef } from '@remotion/player';
import { Play, Pause, RotateCcw, Volume2, Film, BookOpen, Layers } from 'lucide-react';
import storyboardRaw from '../public/assets/aistudio/storyboard_part3_978c475c.json';
import transcriptRaw from '../public/assets/aistudio/transcript3_d3ae5716.json';
import type { StoryboardData, StoryboardScene, TranscriptData } from './types/storyboard';
import { DocumentaryMain } from './DocumentaryMain';
import { resolveActualFileName } from './utils/assetResolver';

const storyboard = storyboardRaw as unknown as StoryboardData;
const transcript = transcriptRaw as unknown as TranscriptData;

type StageFilter =
  | 'ALL'
  | 'STAGE_4_PARALLAX_CUTOUT'
  | 'STAGE_2_ARCHIVAL_BOARD'
  | 'STAGE_3_CANVAS_MONTAGE'
  | 'STAGE_1_FULL_BLEED_VINTAGE';

function formatTimecode(frame: number, fps: number): string {
  const totalSec = Math.max(0, Math.floor(frame / fps));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatStageLabel(stageType: StoryboardScene['stageType']): string {
  switch (stageType) {
    case 'STAGE_4_PARALLAX_CUTOUT':
      return 'Multi-Plane Parallax';
    case 'STAGE_2_ARCHIVAL_BOARD':
      return 'Archival Board';
    case 'STAGE_3_CANVAS_MONTAGE':
      return 'Canvas Montage';
    case 'STAGE_1_FULL_BLEED_VINTAGE':
    default:
      return 'Full-Bleed Vintage';
  }
}

export default function App() {
  const playerRef = useRef<PlayerRef>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageFilter, setStageFilter] = useState<StageFilter>('ALL');

  const { fps, width, height, durationInFrames, title } = storyboard.projectMeta;

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleFrameUpdate: CallbackListener<'frameupdate'> = (e) => {
      setCurrentFrame(e.detail.frame);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    player.addEventListener('frameupdate', handleFrameUpdate);
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);
    player.addEventListener('ended', handleEnded);

    return () => {
      player.removeEventListener('frameupdate', handleFrameUpdate);
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('pause', handlePause);
      player.removeEventListener('ended', handleEnded);
    };
  }, []);

  const activeScene = useMemo(() => {
    return (
      storyboard.scenes.find(
        (s) => currentFrame >= s.startFrame && currentFrame < s.endFrame
      ) ?? storyboard.scenes[0]
    );
  }, [currentFrame]);

  const activeSegment = useMemo(() => {
    const timeSec = currentFrame / fps;
    return transcript.segments.find(
      (seg) => timeSec >= seg.start - 0.1 && timeSec <= seg.end + 0.2
    );
  }, [currentFrame, fps]);

  const filteredScenes = useMemo(() => {
    if (stageFilter === 'ALL') return storyboard.scenes;
    return storyboard.scenes.filter((s) => s.stageType === stageFilter);
  }, [stageFilter]);

  const handleTogglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleRestart = () => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(0);
    player.play();
  };

  const handleSeekToFrame = (frame: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(frame);
    player.play();
  };

  const uniquePlates = useMemo(() => {
    const seen = new Set<string>();
    return storyboard.assetManifest.filter((asset) => {
      const actual = resolveActualFileName(asset.assetId);
      if (seen.has(actual)) return false;
      seen.add(actual);
      return true;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f4efe6] selection:bg-[#b3122a]/40 selection:text-[#f4efe6]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-[#0b0c10]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-8 px-6 py-4">
          <a
            href="#screening"
            className="font-display text-2xl font-semibold tracking-tight text-[#f4efe6] whitespace-nowrap shrink-0"
          >
            The Word He Chose
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm text-stone-400">
            <a
              href="#screening"
              className="hover:text-[#f4efe6] transition-colors whitespace-nowrap shrink-0"
            >
              Screening Room
            </a>
            <a
              href="#scenes"
              className="hover:text-[#f4efe6] transition-colors whitespace-nowrap shrink-0"
            >
              Scene Index
            </a>
            <a
              href="#transcript"
              className="hover:text-[#f4efe6] transition-colors whitespace-nowrap shrink-0"
            >
              Narration
            </a>
            <a
              href="#archive"
              className="hover:text-[#f4efe6] transition-colors whitespace-nowrap shrink-0"
            >
              Archival Plates
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-2 border border-[#c8a45d]/50 bg-[#181b22] px-4 py-2 text-xs font-medium tracking-wide text-[#f4efe6] hover:border-[#c8a45d] hover:bg-[#222630] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? 'Pause Film' : 'Play Film'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1380px] px-6 py-10 space-y-16">
        {/* Screening Room Hero */}
        <section id="screening" className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between border-b border-stone-800/80 pb-6">
            <div className="space-y-2 max-w-3xl">
              <p className="font-tabular text-xs uppercase tracking-widest text-[#c8a45d]">
                Bastogne · December 22–26, 1944 · Part III
              </p>
              <h1
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f4efe6]"
                style={{ textWrap: 'balance' }}
              >
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-5 font-tabular text-xs text-stone-400 shrink-0">
              <span>{formatTimecode(currentFrame, fps)} / {formatTimecode(durationInFrames, fps)}</span>
              <span aria-hidden="true">·</span>
              <span>Frame {currentFrame} / {durationInFrames}</span>
              <span aria-hidden="true">·</span>
              <span>{fps} fps</span>
            </div>
          </div>

          {/* 16:9 Remotion Screening Frame */}
          <div className="border border-stone-800 bg-[#050608] shadow-2xl">
            <div className="relative w-full aspect-video overflow-hidden">
              <Player
                ref={playerRef}
                component={DocumentaryMain}
                durationInFrames={durationInFrames}
                compositionWidth={width}
                compositionHeight={height}
                fps={fps}
                controls
                acknowledgeRemotionLicense
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Active Scene Caption Strip */}
            <div className="flex flex-col gap-4 border-t border-stone-800 bg-[#111318] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-tabular text-xs text-stone-400">
                  <span className="text-[#c8a45d]">
                    {activeScene?.sceneId.replace('_', ' ').toUpperCase()}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScene ? formatStageLabel(activeScene.stageType) : ''}</span>
                  {activeScene?.parallaxVariant && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{activeScene.parallaxVariant.replace(/_/g, ' ')}</span>
                    </>
                  )}
                </div>
                <p className="font-editorial text-base text-[#f4efe6]/90 truncate">
                  {activeSegment?.text || activeScene?.spokenLine}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 border border-stone-700 bg-[#171a21] px-3.5 py-2 text-xs font-medium text-stone-200 hover:border-stone-500 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restart</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Scene Index & Storyboard Timeline */}
        <section id="scenes" className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-stone-800/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-tabular uppercase tracking-widest text-stone-400">
                <Layers className="h-3.5 w-3.5 text-[#c8a45d]" />
                <span>Chronological Sequence</span>
              </div>
              <h2 className="font-display text-3xl font-semibold text-[#f4efe6]">
                Scene Index ({filteredScenes.length} Scenes)
              </h2>
            </div>

            {/* Interactive Stage Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-[#14171d] p-1 border border-stone-800">
              {(
                [
                  ['ALL', 'All Scenes'],
                  ['STAGE_4_PARALLAX_CUTOUT', 'Parallax'],
                  ['STAGE_2_ARCHIVAL_BOARD', 'Archival Board'],
                  ['STAGE_3_CANVAS_MONTAGE', 'Montage'],
                  ['STAGE_1_FULL_BLEED_VINTAGE', 'Full-Bleed'],
                ] as Array<[StageFilter, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStageFilter(value)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    stageFilter === value
                      ? 'bg-[#f4efe6] text-[#0b0c10]'
                      : 'text-stone-400 hover:text-[#f4efe6]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScenes.map((scene) => {
              const isActive = activeScene?.sceneId === scene.sceneId;
              return (
                <button
                  key={scene.sceneId}
                  type="button"
                  onClick={() => handleSeekToFrame(scene.startFrame)}
                  className={`text-left p-5 border transition-colors cursor-pointer flex flex-col justify-between gap-4 ${
                    isActive
                      ? 'border-[#c8a45d] bg-[#181b23]'
                      : 'border-stone-800/90 bg-[#111318] hover:border-stone-600 hover:bg-[#151820]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 font-tabular text-xs text-stone-400">
                      <span className={isActive ? 'text-[#c8a45d]' : 'text-stone-300'}>
                        {scene.sceneId.replace('scene_', 'Scene ')}
                      </span>
                      <span>
                        {formatTimecode(scene.startFrame, fps)} – {formatTimecode(scene.endFrame, fps)}
                      </span>
                    </div>

                    <p className="font-editorial text-sm leading-relaxed text-[#f4efe6]/90 line-clamp-3">
                      “{scene.spokenLine}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-stone-800/70 pt-3 font-tabular text-[11px] text-stone-400">
                    <span>{formatStageLabel(scene.stageType)}</span>
                    <span>{scene.durationInFrames}f</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Transcript & Narration Reader */}
        <section id="transcript" className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-stone-800/80 pt-12">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-tabular uppercase tracking-widest text-stone-400">
              <Volume2 className="h-3.5 w-3.5 text-[#c8a45d]" />
              <span>Voiceover Script</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-[#f4efe6]">
              Synchronized Narration
            </h2>
            <p className="font-editorial text-sm leading-relaxed text-stone-400 max-w-prose">
              Every line is locked at 30 frames per second to the master narration track. Select any passage to jump directly to its corresponding frame in the film.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-stone-800/70 border border-stone-800/90 bg-[#111318]">
            {transcript.segments.map((seg) => {
              const targetFrame = Math.round(seg.start * fps);
              const current = activeSegment?.id === seg.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => handleSeekToFrame(targetFrame)}
                  className={`w-full text-left px-6 py-4 flex items-start gap-6 transition-colors cursor-pointer ${
                    current ? 'bg-[#1a1d26]' : 'hover:bg-[#151820]'
                  }`}
                >
                  <span
                    className={`font-tabular text-xs pt-1 shrink-0 ${
                      current ? 'text-[#c8a45d]' : 'text-stone-500'
                    }`}
                  >
                    {formatTimecode(targetFrame, fps)}
                  </span>
                  <span className="font-editorial text-base leading-relaxed text-[#f4efe6]/90">
                    {seg.text.trim()}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Archival Plates & Visual Manifest */}
        <section id="archive" className="space-y-6 border-t border-stone-800/80 pt-12 pb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-tabular uppercase tracking-widest text-stone-400">
                <BookOpen className="h-3.5 w-3.5 text-[#c8a45d]" />
                <span>Verified Assets on Disk</span>
              </div>
              <h2 className="font-display text-3xl font-semibold text-[#f4efe6]">
                Archival & Composite Plate Catalog
              </h2>
            </div>
            <p className="font-tabular text-xs text-stone-400">
              {uniquePlates.length} distinct plates mounted across {storyboard.scenes.length} scenes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {uniquePlates.map((asset) => {
              const actualFile = resolveActualFileName(asset.assetId);
              return (
                <figure
                  key={asset.assetId}
                  className="border border-stone-800 bg-[#111318] overflow-hidden flex flex-col"
                >
                  <div className="aspect-4/3 bg-[#090a0d] overflow-hidden">
                    <img
                      src={`/assets/${actualFile}`}
                      alt={asset.assetId}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="p-4 space-y-1.5 border-t border-stone-800/80">
                    <div className="font-tabular text-[11px] text-[#c8a45d] truncate">
                      {actualFile}
                    </div>
                    <div className="font-editorial text-xs text-stone-400">
                      {asset.attribution || 'Composite Environment Plate'} · {asset.aspectRatio}
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-800/80 bg-[#090a0d]">
        <div className="mx-auto flex max-w-[1380px] flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 text-xs text-stone-500">
          <div className="flex items-center gap-2 font-editorial">
            <Film className="h-3.5 w-3.5 text-stone-400" />
            <span>The Word He Chose — Bastogne Documentary Render Engine</span>
          </div>
          <div className="font-tabular">
            {width}×{height} · {fps} FPS · {durationInFrames} Frames
          </div>
        </div>
      </footer>
    </div>
  );
}
