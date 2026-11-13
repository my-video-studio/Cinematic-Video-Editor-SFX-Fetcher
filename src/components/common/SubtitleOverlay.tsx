import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import transcriptRaw from '../../../public/assets/aistudio/transcript3_d3ae5716.json';
import type { TranscriptData } from '../../types/storyboard';

const transcript = transcriptRaw as unknown as TranscriptData;

// Clean minor ASR misspellings in display captions without altering timings
function cleanDisplayWord(w: string): string {
  return w
    .replace(/Makalov's/gi, "McAuliffe's")
    .replace(/Makalov/gi, 'McAuliffe')
    .replace(/Canard's/gi, "Kinnard's")
    .replace(/Canard/gi, 'Kinnard')
    .replace(/Premitz/gi, 'Premetz')
    .replace(/René Le Maire/gi, 'Renée Lemaire');
}

export const SubtitleOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;

  const activeSegment = transcript.segments.find(
    (seg) => timeSec >= seg.start - 0.08 && timeSec <= seg.end + 0.18
  );

  if (!activeSegment) {
    return null;
  }

  const segDuration = Math.max(0.2, activeSegment.end - activeSegment.start);
  const elapsed = timeSec - activeSegment.start;
  const opacity = interpolate(
    elapsed,
    [-0.08, 0.08, segDuration - 0.05, segDuration + 0.18],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 46,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 140,
        paddingRight: 140,
        pointerEvents: 'none',
        zIndex: 50,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(8, 10, 14, 0.78)',
          border: '1px solid rgba(246, 244, 238, 0.16)',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 4,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65)',
          maxWidth: 1320,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily:
              '"Georgia", "Times New Roman", serif',
            fontSize: 30,
            lineHeight: 1.35,
            letterSpacing: 0.3,
            color: '#f6f4ee',
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)',
          }}
        >
          {activeSegment.words && activeSegment.words.length > 0
            ? activeSegment.words.map((w, idx) => {
                const isSpoken = timeSec >= w.start;
                const isCurrent = timeSec >= w.start && timeSec <= w.end + 0.12;
                return (
                  <span
                    key={`${activeSegment.id}-${idx}`}
                    style={{
                      color: isCurrent
                        ? '#f5d27a'
                        : isSpoken
                        ? '#f6f4ee'
                        : 'rgba(246, 244, 238, 0.62)',
                      transition: 'color 80ms linear',
                    }}
                  >
                    {cleanDisplayWord(w.word)}
                    {idx < activeSegment.words.length - 1 ? ' ' : ''}
                  </span>
                );
              })
            : cleanDisplayWord(activeSegment.text)}
        </span>
      </div>
    </div>
  );
};
