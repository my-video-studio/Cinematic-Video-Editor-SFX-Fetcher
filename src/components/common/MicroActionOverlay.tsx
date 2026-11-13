import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import type { MicroAction } from '../../types/storyboard';

export interface MicroActionOverlayProps {
  microActions?: MicroAction[];
  sceneStartFrame: number;
}

export const MicroActionOverlay: React.FC<MicroActionOverlayProps> = ({
  microActions,
  sceneStartFrame,
}) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!microActions || microActions.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 35,
        overflow: 'hidden',
      }}
    >
      {microActions.map((action, idx) => {
        const relTrigger = Math.max(0, action.triggerFrame - sceneStartFrame);
        const f = localFrame - relTrigger;
        if (f < 0) return null;

        const enterSpring = spring({
          frame: f,
          fps,
          config: { damping: 14, stiffness: 180, mass: 0.8 },
        });

        const slamSpring = spring({
          frame: f,
          fps,
          config: { damping: 10, stiffness: 260, mass: 0.7 },
        });

        if (action.type === 'rank_badge_pin') {
          const rankIdx = microActions
            .slice(0, idx)
            .filter((a) => a.type === 'rank_badge_pin').length;
          const stackOffset = rankIdx * 62;
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                left: 64,
                bottom: 148 + stackOffset,
                transform: `translateY(${(1 - enterSpring) * 26}px) scale(${
                  0.94 + enterSpring * 0.06
                })`,
                opacity: enterSpring,
                backgroundColor: 'rgba(14, 18, 22, 0.88)',
                borderLeft: '5px solid #c99e46',
                borderTop: '1px solid rgba(246, 244, 238, 0.2)',
                borderRight: '1px solid rgba(246, 244, 238, 0.14)',
                borderBottom: '1px solid rgba(246, 244, 238, 0.14)',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 18,
                paddingRight: 22,
                boxShadow: '0 14px 32px rgba(0,0,0,0.65)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  color: '#f6f4ee',
                  textTransform: 'uppercase',
                }}
              >
                {action.badgeText}
              </span>
            </div>
          );
        }

        if (action.type === 'hud_timestamp_pin') {
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                top: 48,
                left: 64,
                transform: `translateX(${(1 - enterSpring) * -32}px)`,
                opacity: enterSpring,
                backgroundColor: 'rgba(12, 15, 20, 0.86)',
                border: '1px solid rgba(201, 158, 70, 0.55)',
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 16,
                paddingRight: 16,
                boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 2.2,
                  color: '#e8c472',
                }}
              >
                {action.badgeText}
              </span>
            </div>
          );
        }

        if (action.type === 'caption_pin') {
          const capIdx = microActions
            .slice(0, idx)
            .filter((a) => a.type === 'caption_pin').length;
          const rightPos = capIdx % 2 === 1;
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                top: 52 + capIdx * 58,
                ...(rightPos ? { right: 64 } : { left: 64 }),
                transform: `scale(${0.88 + enterSpring * 0.12})`,
                opacity: enterSpring,
                backgroundColor: 'rgba(179, 18, 42, 0.92)',
                border: '1px solid rgba(246, 244, 238, 0.35)',
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 18,
                paddingRight: 18,
                boxShadow: '0 10px 26px rgba(0,0,0,0.6)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Arial Narrow", "Impact", sans-serif',
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 2.4,
                  color: '#f6f4ee',
                }}
              >
                {action.text}
              </span>
            </div>
          );
        }

        if (action.type === 'number_counter_lock') {
          const cntIdx = microActions
            .slice(0, idx)
            .filter((a) => a.type === 'number_counter_lock').length;
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                right: 64,
                top: 52 + cntIdx * 72,
                transform: `scale(${1.25 - slamSpring * 0.25})`,
                opacity: slamSpring,
                backgroundColor: 'rgba(15, 18, 22, 0.92)',
                borderLeft: '6px solid #b3122a',
                borderTop: '1px solid rgba(246, 244, 238, 0.25)',
                borderRight: '1px solid rgba(246, 244, 238, 0.25)',
                borderBottom: '1px solid rgba(246, 244, 238, 0.25)',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 20,
                paddingRight: 22,
                boxShadow: '0 14px 32px rgba(0,0,0,0.7)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: '#f5d27a',
                }}
              >
                {action.value}
              </span>
            </div>
          );
        }

        if (action.type === 'rubber_stamp_slam') {
          const scale = interpolate(slamSpring, [0, 1], [2.4, 1]);
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                right: 90,
                bottom: 185,
                transform: `rotate(-8deg) scale(${scale})`,
                opacity: Math.min(1, slamSpring * 1.15),
                border: '6px solid #b3122a',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 26,
                paddingRight: 26,
                backgroundColor: 'rgba(246, 244, 238, 0.9)',
                boxShadow: '0 16px 38px rgba(0,0,0,0.65)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: 4,
                  color: '#b3122a',
                }}
              >
                {action.stampText}
              </span>
            </div>
          );
        }

        if (action.type === 'red_x_strike') {
          const drawP = interpolate(f, [0, 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                right: 76,
                top: 64,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                backgroundColor: 'rgba(14, 16, 20, 0.86)',
                border: '2px solid rgba(179, 18, 42, 0.8)',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 18,
                paddingRight: 20,
                opacity: enterSpring,
              }}
            >
              <svg width="34" height="34" viewBox="0 0 34 34">
                <line
                  x1="5"
                  y1="5"
                  x2={5 + 24 * drawP}
                  y2={5 + 24 * drawP}
                  stroke="#e11d1d"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <line
                  x1="29"
                  y1="5"
                  x2={29 - 24 * Math.max(0, drawP * 2 - 1)}
                  y2={5 + 24 * Math.max(0, drawP * 2 - 1)}
                  stroke="#e11d1d"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: 1.8,
                  color: '#f6f4ee',
                }}
              >
                {action.text}
              </span>
            </div>
          );
        }

        if (action.type === 'red_line_halt') {
          const lineW = interpolate(f, [0, 18], [0, 100], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '54%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: `${lineW}%`,
                  height: 4,
                  backgroundColor: '#c91b2e',
                  boxShadow: '0 0 18px rgba(201, 27, 46, 0.85)',
                }}
              />
              {action.text && (
                <div
                  style={{
                    marginTop: 12,
                    backgroundColor: 'rgba(179, 18, 42, 0.9)',
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 16,
                    paddingRight: 16,
                    opacity: enterSpring,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: 20,
                      fontWeight: 800,
                      letterSpacing: 2.5,
                      color: '#f6f4ee',
                    }}
                  >
                    {action.text}
                  </span>
                </div>
              )}
            </div>
          );
        }

        if (action.type === 'red_ink_circle') {
          const dashOffset = interpolate(f, [0, 22], [1100, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <svg
                width="520"
                height="320"
                viewBox="0 0 520 320"
                style={{ transform: 'translate(-120px, -20px)' }}
              >
                <ellipse
                  cx="260"
                  cy="160"
                  rx="220"
                  ry="120"
                  fill="none"
                  stroke="#c91b2e"
                  strokeWidth="7"
                  strokeDasharray="1100"
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              {action.targetText && (
                <div
                  style={{
                    position: 'absolute',
                    left: 64,
                    bottom: 160,
                    backgroundColor: 'rgba(179, 18, 42, 0.9)',
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 16,
                    paddingRight: 16,
                    opacity: enterSpring,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: 20,
                      fontWeight: 800,
                      letterSpacing: 2,
                      color: '#f6f4ee',
                    }}
                  >
                    {action.targetText}
                  </span>
                </div>
              )}
            </div>
          );
        }

        if (action.type === 'route_arrow_draw') {
          const dashOffset = interpolate(f, [0, 24], [600, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <svg
              key={`${action.type}-${idx}`}
              width="1920"
              height="1080"
              viewBox="0 0 1920 1080"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <path
                d="M 960 540 Q 820 510 660 525"
                fill="none"
                stroke="#d4202a"
                strokeWidth="8"
                strokeDasharray="600"
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
              {f > 18 && (
                <polygon
                  points="645,527 680,508 677,544"
                  fill="#d4202a"
                  opacity={Math.min(1, (f - 18) / 6)}
                />
              )}
            </svg>
          );
        }

        if (action.type === 'question_mark_pulse') {
          const pulse = 1 + Math.sin(f * 0.25) * 0.06;
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                right: 120,
                top: 140,
                transform: `scale(${enterSpring * pulse})`,
                opacity: 0.75 * enterSpring,
              }}
            >
              <span
                style={{
                  fontFamily: '"Georgia", serif',
                  fontSize: 170,
                  fontWeight: 900,
                  color: '#e8c472',
                  textShadow: '0 8px 28px rgba(0,0,0,0.85)',
                }}
              >
                ?
              </span>
            </div>
          );
        }

        if (action.type === 'road_line_light_up') {
          const glowOpacity = interpolate(f, [0, 18], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <svg
              key={`${action.type}-${idx}`}
              width="1920"
              height="1080"
              viewBox="0 0 1920 1080"
              style={{ position: 'absolute', top: 0, left: 0, opacity: glowOpacity }}
            >
              <path
                d="M 960 1080 Q 950 780 960 560"
                fill="none"
                stroke="#f5d27a"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          );
        }

        if (action.type === 'room_warm_light_bloom' || action.type === 'pencil_hover') {
          const bloom = interpolate(f, [0, 18], [0, 0.28], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'radial-gradient(circle at 50% 45%, rgba(255, 196, 102, 0.55) 0%, rgba(255, 165, 60, 0) 65%)',
                opacity: bloom,
              }}
            />
          );
        }

        if (action.type === 'paper_crumple_burst') {
          const burst = interpolate(f, [0, 14], [0.8, 1.35], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const fade = interpolate(f, [0, 8, 28], [0, 0.5, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: fade,
                transform: `scale(${burst})`,
              }}
            >
              <div
                style={{
                  width: 340,
                  height: 340,
                  borderRadius: '50%',
                  border: '3px dashed rgba(246, 244, 238, 0.65)',
                }}
              />
            </div>
          );
        }

        if (action.type === 'typewriter_keys_strike') {
          const pulse = Math.abs(Math.sin(f * 0.9)) * 0.22;
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                right: 64,
                top: 64,
                opacity: enterSpring,
                backgroundColor: 'rgba(246, 244, 238, 0.92)',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 18,
                paddingRight: 18,
                boxShadow: `0 0 ${24 + pulse * 40}px rgba(245, 210, 122, 0.45)`,
              }}
            >
              <span
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: '#161616',
                }}
              >
                TYPING: N - U - T - S
              </span>
            </div>
          );
        }

        if (action.type === 'silence_vignette') {
          const dark = interpolate(f, [0, 25], [0, 0.45], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={`${action.type}-${idx}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                boxShadow: `inset 0 0 240px rgba(0, 0, 0, ${0.4 + dark})`,
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
};
