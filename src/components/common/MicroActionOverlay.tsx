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
  sceneId?: string;
  microActions?: MicroAction[];
  sceneStartFrame: number;
  sequenceDurationInFrames: number;
}

type ClassifiedOverlay =
  | {
      kind: 'monumental_year';
      text: string;
      subLabel?: string;
      rulerProgress: number;
      relTrigger: number;
    }
  | {
      kind: 'top_left_counter';
      stages: Array<{
        relTrigger: number;
        header: string;
        targetValue: number;
        prefix?: string;
        suffix?: string;
        isFatal?: boolean;
        breadcrumbLabel?: string;
      }>;
    }
  | {
      kind: 'paper_ink_circle';
      text: string;
      relTrigger: number;
    }
  | {
      kind: 'translucent_stamp';
      text: string;
      relTrigger: number;
    }
  | {
      kind: 'thesis_strike';
      supersededClaim: string;
      trueThesis: string;
      relTrigger: number;
    }
  | {
      kind: 'minimal_pin';
      text: string;
      relTrigger: number;
    }
  | {
      kind: 'ambient_visual';
      visualType:
        | 'route_arrow_draw'
        | 'red_ink_circle_svg'
        | 'document_focus_pull'
        | 'empty_chair_rack_focus'
        | 'room_warm_light_bloom'
        | 'pencil_hover'
        | 'figures_recede_silhouette'
        | 'empty_sky_drift'
        | 'silence_vignette'
        | 'road_line_light_up';
      relTrigger: number;
    }
  | {
      kind: 'skip';
    };

function normalizeRelTrigger(
  triggerFrame: number,
  sceneStartFrame: number,
  sequenceDurationInFrames: number
): number {
  const rawRel = Math.max(0, triggerFrame - sceneStartFrame);
  return Math.min(rawRel, Math.max(8, sequenceDurationInFrames - 95));
}

function getWindowOpacity(
  localFrame: number,
  relTrigger: number,
  sequenceDurationInFrames: number,
  fadeInFrames = 14,
  holdWindow = 105
): number {
  if (localFrame < relTrigger) return 0;
  const f = localFrame - relTrigger;
  const maxVisibleEnd = Math.min(sequenceDurationInFrames, relTrigger + holdWindow);
  const fadeOutStart = Math.max(relTrigger + fadeInFrames + 12, maxVisibleEnd - 16);

  const fadeIn = interpolate(f, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    localFrame,
    [fadeOutStart, maxVisibleEnd],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  return Math.min(fadeIn, fadeOut);
}

/**
 * Slot-Wheel Vertical Digit Roll for Monumental Years / Dates
 */
const SlotWheelText: React.FC<{
  text: string;
  localElapsed: number;
  fontSize: number;
}> = ({ text, localElapsed, fontSize }) => {
  const chars = text.split('');
  const rollProgress = interpolate(localElapsed, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.22em',
        fontFamily: '"Cinzel", "Cormorant Garamond", Georgia, serif',
        fontSize,
        fontWeight: 600,
        lineHeight: 1.05,
        fontVariantNumeric: 'lining-nums tabular-nums',
        color: '#F4F1EA',
        textShadow: '0 8px 34px rgba(0, 0, 0, 0.85)',
      }}
    >
      {chars.map((ch, i) => {
        const isDigit = ch >= '0' && ch <= '9';
        if (!isDigit) {
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                minWidth: ch === ' ' ? '0.28em' : undefined,
              }}
            >
              {ch}
            </span>
          );
        }
        const d = Number(ch);
        const slotDigits = [(d + 8) % 10, (d + 9) % 10, d];
        const staggerOffset = Math.max(0, i * 0.04);
        const charProgress = interpolate(
          rollProgress,
          [staggerOffset, Math.min(1, 0.82 + staggerOffset)],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const translateYEm = interpolate(charProgress, [0, 1], [0, -2.24]);

        return (
          <div
            key={i}
            style={{
              height: '1.12em',
              overflow: 'hidden',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${translateYEm}em)`,
              }}
            >
              {slotDigits.map((sd, idx) => (
                <span
                  key={idx}
                  style={{
                    height: '1.12em',
                    lineHeight: '1.12em',
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  {sd}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const MicroActionOverlay: React.FC<MicroActionOverlayProps> = ({
  sceneId = '',
  microActions,
  sceneStartFrame,
  sequenceDurationInFrames,
}) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!microActions || microActions.length === 0) {
    return null;
  }

  // Classify storyboard actions into strict restrained cinematic treatments or skip
  const classified: ClassifiedOverlay[] = [];
  const counterStages: Array<{
    relTrigger: number;
    header: string;
    targetValue: number;
    prefix?: string;
    suffix?: string;
    isFatal?: boolean;
    breadcrumbLabel?: string;
  }> = [];

  for (const action of microActions) {
    const rel = normalizeRelTrigger(
      action.triggerFrame,
      sceneStartFrame,
      sequenceDurationInFrames
    );

    // Pure atmospheric / non-text visual effects
    if (
      action.type === 'route_arrow_draw' ||
      action.type === 'document_focus_pull' ||
      action.type === 'empty_chair_rack_focus' ||
      action.type === 'room_warm_light_bloom' ||
      action.type === 'pencil_hover' ||
      action.type === 'figures_recede_silhouette' ||
      action.type === 'empty_sky_drift' ||
      action.type === 'silence_vignette' ||
      action.type === 'road_line_light_up'
    ) {
      classified.push({
        kind: 'ambient_visual',
        visualType: action.type,
        relTrigger: Math.max(0, action.triggerFrame - sceneStartFrame),
      });
      continue;
    }

    if (action.type === 'red_ink_circle') {
      classified.push({
        kind: 'ambient_visual',
        visualType: 'red_ink_circle_svg',
        relTrigger: Math.max(0, action.triggerFrame - sceneStartFrame),
      });
      continue;
    }

    // Treatment A: Monumental Center Year / Date Reveal (only pivotal chronological markers)
    if (action.type === 'hud_timestamp_pin') {
      if (sceneId === 'scene_29') {
        classified.push({
          kind: 'monumental_year',
          text: '23 DEC 1944',
          subLabel: 'SKIES CLEAR OVER BASTOGNE',
          rulerProgress: 0.25,
          relTrigger: rel,
        });
      } else if (sceneId === 'scene_30') {
        classified.push({
          kind: 'monumental_year',
          text: '24 DEC 1944',
          subLabel: 'CHRISTMAS EVE RAID • BASTOGNE',
          rulerProgress: 0.42,
          relTrigger: rel,
        });
      } else if (sceneId === 'scene_32') {
        classified.push({
          kind: 'monumental_year',
          text: '25 DEC 1944',
          subLabel: 'CHRISTMAS MORNING ASSAULT',
          rulerProgress: 0.58,
          relTrigger: rel,
        });
      } else if (sceneId === 'scene_34') {
        classified.push({
          kind: 'monumental_year',
          text: '26 DEC 1944',
          subLabel: '16:50 HRS • SIEGE BROKEN',
          rulerProgress: 0.76,
          relTrigger: rel,
        });
      } else if (sceneId === 'scene_36') {
        classified.push({
          kind: 'monumental_year',
          text: 'JAN 1945',
          subLabel: '101ST HOLDS THE PERIMETER',
          rulerProgress: 0.92,
          relTrigger: rel,
        });
      } else {
        classified.push({ kind: 'skip' });
      }
      continue;
    }

    // Treatment B: Unified Top-Left Precision Data Counter (genuine tallies & casualties)
    if (action.type === 'number_counter_lock') {
      if (sceneId === 'scene_27') {
        counterStages.push({
          relTrigger: rel,
          header: 'ARTILLERY AMMUNITION',
          targetValue: 10,
          suffix: ' ROUNDS / GUN',
          isFatal: false,
        });
      } else if (sceneId === 'scene_29') {
        const val = action.value || '';
        if (val.includes('241')) {
          counterStages.push({
            relTrigger: rel,
            header: 'AIRLIFT SORTIES',
            targetValue: 241,
            suffix: ' C-47s',
            isFatal: false,
            breadcrumbLabel: '241 C-47 TRANSPORTS',
          });
        } else {
          counterStages.push({
            relTrigger: Math.max(rel, (counterStages[0]?.relTrigger ?? 0) + 75),
            header: 'SUPPLIES AIRDROPPED',
            targetValue: 144,
            suffix: ' TONS',
            isFatal: false,
          });
        }
      } else if (sceneId === 'scene_30') {
        counterStages.push({
          relTrigger: rel,
          header: 'AID STATION CASUALTIES',
          targetValue: 30,
          prefix: '~',
          isFatal: true,
        });
      } else if (sceneId === 'scene_33') {
        counterStages.push({
          relTrigger: rel,
          header: 'GERMAN TANKS BREACHED',
          targetValue: 18,
          isFatal: false,
        });
      }
      continue;
    }

    // Treatment C: Parchment Extract with Hand-Drawn Red Ink Oval
    if (action.type === 'caption_pin' && sceneId === 'scene_31') {
      classified.push({
        kind: 'paper_ink_circle',
        text: '“SURRENDER DEMAND & REPLY”',
        relTrigger: rel,
      });
      continue;
    }

    // Treatment D: Translucent Distressed Red Ink Stamp (pivotal verdicts only)
    if (action.type === 'rubber_stamp_slam') {
      if (sceneId === 'scene_18') {
        classified.push({
          kind: 'translucent_stamp',
          text: 'N-U-T-S',
          relTrigger: rel,
        });
      } else if (sceneId === 'scene_22') {
        classified.push({
          kind: 'translucent_stamp',
          text: 'NOT AFFIRMATIVE',
          relTrigger: rel,
        });
      } else if (sceneId === 'scene_33') {
        classified.push({
          kind: 'translucent_stamp',
          text: 'ALL DESTROYED',
          relTrigger: Math.max(rel, 250),
        });
      } else {
        classified.push({ kind: 'skip' });
      }
      continue;
    }

    // Treatment E1: Two-Line Red Strikethrough Thesis
    if (
      action.type === 'caption_pin' &&
      sceneId === 'scene_39' &&
      action.text === 'DEFENSE IN PLACE'
    ) {
      classified.push({
        kind: 'thesis_strike',
        supersededClaim: 'SURRENDER DEMAND',
        trueThesis: 'Defense in Place',
        relTrigger: rel,
      });
      continue;
    }

    // Treatment E2: Minimal Red-Pin Callout (essential lower-third person/unit identification only)
    if (action.type === 'rank_badge_pin') {
      if (
        sceneId === 'scene_30' ||
        sceneId === 'scene_34' ||
        sceneId === 'scene_41'
      ) {
        classified.push({
          kind: 'minimal_pin',
          text: action.badgeText || '',
          relTrigger: rel,
        });
      } else {
        classified.push({ kind: 'skip' });
      }
      continue;
    }

    // Everything else is conversational filler -> skip
    classified.push({ kind: 'skip' });
  }

  if (counterStages.length > 0) {
    classified.push({
      kind: 'top_left_counter',
      stages: counterStages,
    });
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
      {classified.map((item, idx) => {
        if (item.kind === 'skip') return null;

        // =====================================================================
        // TREATMENT A — Monumental Center Year / Date Reveal
        // =====================================================================
        if (item.kind === 'monumental_year') {
          const opacity = getWindowOpacity(
            localFrame,
            item.relTrigger,
            sequenceDurationInFrames,
            14,
            100
          );
          if (opacity <= 0.005) return null;

          const f = localFrame - item.relTrigger;
          const isFourDigitYear = /^\d{4}$/.test(item.text.trim());
          const fontSize = isFourDigitYear ? 112 : 74;

          const hairlineW = interpolate(f, [4, 24], [30, 165], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const subOpacity = interpolate(f, [14, 28], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={`monumental-${idx}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity,
              }}
            >
              {/* Deep atmospheric vignette + warm amber radial glow */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'radial-gradient(ellipse 860px 440px at 50% 46%, rgba(14, 15, 19, 0.88) 0%, rgba(10, 12, 16, 0.72) 48%, transparent 82%), radial-gradient(circle at 50% 46%, rgba(185, 108, 45, 0.28) 0%, transparent 52%)',
                }}
              />

              {/* Frameless Center Stage (960, 465) */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 465,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 32,
                  }}
                >
                  {/* Left 1px Hairline + Crosshair Tick */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 1,
                        height: 7,
                        backgroundColor: 'rgba(244, 241, 234, 0.5)',
                      }}
                    />
                    <div
                      style={{
                        width: hairlineW,
                        height: 1,
                        backgroundColor: 'rgba(244, 241, 234, 0.45)',
                      }}
                    />
                  </div>

                  <SlotWheelText
                    text={item.text}
                    localElapsed={f}
                    fontSize={fontSize}
                  />

                  {/* Right 1px Hairline + Crosshair Tick */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: hairlineW,
                        height: 1,
                        backgroundColor: 'rgba(244, 241, 234, 0.45)',
                      }}
                    />
                    <div
                      style={{
                        width: 1,
                        height: 7,
                        backgroundColor: 'rgba(244, 241, 234, 0.5)',
                      }}
                    />
                  </div>
                </div>

                {item.subLabel && (
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: 13,
                      letterSpacing: '0.34em',
                      color: 'rgba(244, 241, 234, 0.64)',
                      textTransform: 'uppercase',
                      opacity: subOpacity,
                    }}
                  >
                    {item.subLabel}
                  </span>
                )}
              </div>

              {/* Bottom 1px Timeline Ruler at bottom: 168px */}
              <div
                style={{
                  position: 'absolute',
                  left: 220,
                  right: 220,
                  bottom: 168,
                  height: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${item.rulerProgress * 100}%`,
                    bottom: 0,
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      color: '#EF4444',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.text}
                  </span>
                  <div
                    style={{
                      width: 1,
                      height: 6,
                      backgroundColor: '#EF4444',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }

        // =====================================================================
        // TREATMENT B — Unified Top-Left Precision Data Counter
        // =====================================================================
        if (item.kind === 'top_left_counter') {
          const firstStage = item.stages[0];
          const lastStage = item.stages[item.stages.length - 1];
          const totalHoldEnd = Math.min(
            sequenceDurationInFrames,
            lastStage.relTrigger + 105
          );
          if (localFrame < firstStage.relTrigger || localFrame > totalHoldEnd) {
            return null;
          }

          const f = localFrame - firstStage.relTrigger;
          const fadeIn = interpolate(f, [0, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const fadeOut = interpolate(
            localFrame,
            [Math.max(firstStage.relTrigger + 30, totalHoldEnd - 16), totalHoldEnd],
            [1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const opacity = Math.min(fadeIn, fadeOut);

          // Center Stage (960, 465, scale 1.24) for 34 frames -> glides 34..54f to Top-Left (64, 76, scale 1.0)
          const glideP = interpolate(f, [34, 54], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          });
          const leftPx = interpolate(glideP, [0, 1], [960, 64]);
          const topPx = interpolate(glideP, [0, 1], [465, 76]);
          const txPct = interpolate(glideP, [0, 1], [-50, 0]);
          const tyPct = interpolate(glideP, [0, 1], [-50, 0]);
          const cardScale = interpolate(glideP, [0, 1], [1.24, 1.0]);

          // Determine active stage & smooth rolling value
          let activeIdx = 0;
          for (let i = 0; i < item.stages.length; i++) {
            if (localFrame >= item.stages[i].relTrigger) {
              activeIdx = i;
            }
          }
          const activeStage = item.stages[activeIdx];
          const stageElapsed = localFrame - activeStage.relTrigger;
          const prevValue =
            activeIdx > 0 ? item.stages[activeIdx - 1].targetValue : 0;

          const countProgress = interpolate(stageElapsed, [0, 22], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const currentNum = Math.round(
            interpolate(countProgress, [0, 1], [prevValue, activeStage.targetValue])
          );
          const breadcrumbs = item.stages
            .slice(0, activeIdx)
            .map((s) => s.breadcrumbLabel)
            .filter(Boolean);

          return (
            <div
              key={`counter-${idx}`}
              style={{
                position: 'absolute',
                left: leftPx,
                top: topPx,
                transform: `translate(${txPct}%, ${tyPct}%) scale(${cardScale})`,
                transformOrigin: 'top left',
                opacity,
                backgroundColor: 'rgba(15, 18, 22, 0.90)',
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 34,
                paddingRight: 34,
                boxShadow: '0 22px 48px rgba(0, 0, 0, 0.72)',
              }}
            >
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 13,
                  letterSpacing: '0.22em',
                  color: 'rgba(226, 232, 240, 0.62)',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {activeStage.header}
              </div>

              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 58,
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: '0.07em',
                  fontVariantNumeric: 'tabular-nums',
                  color: activeStage.isFatal ? '#EF4444' : '#F8FAFC',
                  whiteSpace: 'nowrap',
                }}
              >
                {activeStage.prefix || ''}
                {currentNum.toLocaleString('en-US')}
                {activeStage.suffix ? (
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 400,
                      letterSpacing: '0.16em',
                      color: 'rgba(226, 232, 240, 0.72)',
                      marginLeft: 6,
                    }}
                  >
                    {activeStage.suffix}
                  </span>
                ) : null}
              </div>

              {breadcrumbs.length > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: '1px solid rgba(226, 232, 240, 0.14)',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    color: 'rgba(226, 232, 240, 0.5)',
                    textTransform: 'uppercase',
                  }}
                >
                  PREV: {breadcrumbs.join(' · ')}
                </div>
              )}
            </div>
          );
        }

        // =====================================================================
        // TREATMENT C — Parchment Extract with Hand-Drawn Red Ink Oval
        // =====================================================================
        if (item.kind === 'paper_ink_circle') {
          const opacity = getWindowOpacity(
            localFrame,
            item.relTrigger,
            sequenceDurationInFrames,
            14,
            110
          );
          if (opacity <= 0.005) return null;

          const f = localFrame - item.relTrigger;
          const enterY = interpolate(f, [0, 16], [18, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const ovalOffset = interpolate(f, [8, 28], [1200, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          });

          return (
            <div
              key={`paper-ink-${idx}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: 735,
                transform: `translate(-50%, calc(-50% + ${enterY}px))`,
                opacity,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(236, 230, 216, 0.95)',
                  paddingTop: 18,
                  paddingBottom: 18,
                  paddingLeft: 42,
                  paddingRight: 42,
                  border: '1px solid rgba(120, 110, 90, 0.35)',
                  boxShadow: '0 22px 46px rgba(0, 0, 0, 0.65)',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 36,
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    color: '#18181b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.text}
                </span>

                {/* Organic Hand-Drawn Red Ink Oval */}
                <svg
                  width="112%"
                  height="155%"
                  viewBox="0 0 600 120"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    left: '-6%',
                    top: '-27%',
                    pointerEvents: 'none',
                    overflow: 'visible',
                  }}
                >
                  <path
                    d="M 42 58 C 46 16, 185 8, 305 11 C 445 14, 566 24, 564 60 C 562 96, 435 112, 298 109 C 155 106, 36 92, 46 53 C 49 38, 72 28, 105 22"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.8"
                    strokeDasharray="1200"
                    strokeDashoffset={ovalOffset}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          );
        }

        // =====================================================================
        // TREATMENT D — Translucent Distressed Red Ink Stamp
        // =====================================================================
        if (item.kind === 'translucent_stamp') {
          const opacity = getWindowOpacity(
            localFrame,
            item.relTrigger,
            sequenceDurationInFrames,
            8,
            105
          );
          if (opacity <= 0.005) return null;

          const f = localFrame - item.relTrigger;
          const slam = spring({
            frame: Math.max(0, f),
            fps,
            config: { stiffness: 210, damping: 14 },
          });
          const stampScale = interpolate(slam, [0, 1], [1.55, 1.0]);

          return (
            <div
              key={`stamp-${idx}`}
              style={{
                position: 'absolute',
                right: 110,
                bottom: 185,
                transform: `rotate(-6deg) scale(${stampScale})`,
                opacity,
                backgroundColor: 'rgba(220, 38, 38, 0.06)',
                border: '4px solid rgba(220, 38, 38, 0.82)',
                outline: '1.5px solid rgba(220, 38, 38, 0.45)',
                outlineOffset: '-8px',
                paddingTop: 14,
                paddingBottom: 14,
                paddingLeft: 32,
                paddingRight: 32,
              }}
            >
              <span
                style={{
                  fontFamily: '"Cinzel", "Oswald", serif',
                  fontSize: 58,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'rgba(220, 38, 38, 0.88)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.text}
              </span>
            </div>
          );
        }

        // =====================================================================
        // TREATMENT E1 — Two-Line Red Strikethrough Thesis
        // =====================================================================
        if (item.kind === 'thesis_strike') {
          const opacity = getWindowOpacity(
            localFrame,
            item.relTrigger,
            sequenceDurationInFrames,
            12,
            105
          );
          if (opacity <= 0.005) return null;

          const f = localFrame - item.relTrigger;
          const strikePct = interpolate(f, [14, 30], [0, 100], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const claimOpacity = interpolate(f, [14, 30], [0.95, 0.48], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const thesisReveal = interpolate(f, [24, 42], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const thesisY = interpolate(thesisReveal, [0, 1], [16, 0]);

          return (
            <div
              key={`thesis-${idx}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'radial-gradient(ellipse 900px 420px at 50% 48%, rgba(10, 12, 16, 0.86) 0%, rgba(10, 12, 16, 0.45) 58%, transparent 88%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 465,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 18,
                }}
              >
                {/* Superseded Claim + Horizontal Red Strikethrough */}
                <div
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    opacity: claimOpacity,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: 26,
                      letterSpacing: '0.24em',
                      color: '#E2E8F0',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.supersededClaim}
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-4%',
                      top: '50%',
                      width: `${strikePct * 1.08}%`,
                      height: 2.5,
                      backgroundColor: '#EF4444',
                      transform: 'translateY(-50%)',
                    }}
                  />
                </div>

                {/* True Thesis Below */}
                <div
                  style={{
                    fontFamily: '"Cormorant Garamond", "Cinzel", Georgia, serif',
                    fontSize: 68,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: '#F8FAFC',
                    opacity: thesisReveal,
                    transform: `translateY(${thesisY}px)`,
                    textShadow: '0 8px 30px rgba(0, 0, 0, 0.88)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.trueThesis}
                </div>
              </div>
            </div>
          );
        }

        // =====================================================================
        // TREATMENT E2 — Minimal Red-Pin Callout
        // =====================================================================
        if (item.kind === 'minimal_pin') {
          const opacity = getWindowOpacity(
            localFrame,
            item.relTrigger,
            sequenceDurationInFrames,
            12,
            100
          );
          if (opacity <= 0.005) return null;

          const f = localFrame - item.relTrigger;
          const lineW = interpolate(f, [2, 18], [0, 44], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const tagOpacity = interpolate(f, [10, 22], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={`pin-${idx}`}
              style={{
                position: 'absolute',
                left: 72,
                bottom: 88,
                display: 'flex',
                alignItems: 'center',
                opacity,
              }}
            >
              {/* 8px Glowing Red Dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.85)',
                  flexShrink: 0,
                }}
              />
              {/* Animated 44px x 1px Red Leader Line */}
              <div
                style={{
                  width: lineW,
                  height: 1,
                  backgroundColor: '#EF4444',
                  flexShrink: 0,
                }}
              />
              {/* Compact Dark Slate Tag */}
              <div
                style={{
                  opacity: tagOpacity,
                  backgroundColor: 'rgba(14, 17, 21, 0.88)',
                  paddingTop: 9,
                  paddingBottom: 9,
                  paddingLeft: 18,
                  paddingRight: 20,
                  boxShadow: '0 10px 26px rgba(0, 0, 0, 0.65)',
                }}
              >
                <span
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    color: '#F4F1EA',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.text}
                </span>
              </div>
            </div>
          );
        }

        // =====================================================================
        // PURE NON-TEXT ATMOSPHERIC / MAP VISUALS
        // =====================================================================
        if (item.kind === 'ambient_visual') {
          const f = localFrame - item.relTrigger;
          if (f < 0) return null;

          if (item.visualType === 'route_arrow_draw') {
            const dashOffset = interpolate(f, [0, 24], [600, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <svg
                key={`vis-${idx}`}
                width="1920"
                height="1080"
                viewBox="0 0 1920 1080"
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                <path
                  d="M 960 540 Q 820 510 660 525"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="6"
                  strokeDasharray="600"
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
                {f > 18 && (
                  <polygon
                    points="645,527 680,508 677,544"
                    fill="#dc2626"
                    opacity={Math.min(1, (f - 18) / 6)}
                  />
                )}
              </svg>
            );
          }

          if (item.visualType === 'red_ink_circle_svg') {
            const dashOffset = interpolate(f, [0, 22], [1100, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`vis-${idx}`}
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
                    stroke="#dc2626"
                    strokeWidth="5"
                    strokeDasharray="1100"
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            );
          }

          if (item.visualType === 'road_line_light_up') {
            const glowOpacity = interpolate(f, [0, 18], [0, 0.75], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <svg
                key={`vis-${idx}`}
                width="1920"
                height="1080"
                viewBox="0 0 1920 1080"
                style={{ position: 'absolute', top: 0, left: 0, opacity: glowOpacity }}
              >
                <path
                  d="M 960 1080 Q 950 780 960 560"
                  fill="none"
                  stroke="#f5d27a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.65"
                />
              </svg>
            );
          }

          if (
            item.visualType === 'room_warm_light_bloom' ||
            item.visualType === 'pencil_hover'
          ) {
            const bloom = interpolate(f, [0, 18], [0, 0.24], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`vis-${idx}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(255, 196, 102, 0.5) 0%, rgba(255, 165, 60, 0) 65%)',
                  opacity: bloom,
                }}
              />
            );
          }

          if (item.visualType === 'document_focus_pull') {
            const pullOpacity = interpolate(f, [0, 14, 48], [0, 0.34, 0.2], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`vis-${idx}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'radial-gradient(ellipse 46% 38% at 50% 52%, rgba(255, 240, 200, 0.14) 0%, rgba(5, 7, 10, 0.72) 72%, rgba(4, 5, 8, 0.88) 100%)',
                  opacity: pullOpacity,
                }}
              />
            );
          }

          if (item.visualType === 'empty_chair_rack_focus') {
            const rackOpacity = interpolate(f, [0, 16, 52], [0, 0.36, 0.18], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`vis-${idx}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'radial-gradient(circle at 38% 58%, rgba(215, 225, 238, 0.1) 0%, rgba(6, 8, 12, 0.76) 65%)',
                  opacity: rackOpacity,
                }}
              />
            );
          }

          if (item.visualType === 'figures_recede_silhouette') {
            const mistOpacity = interpolate(f, [0, 32], [0, 0.4], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`vis-${idx}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(180deg, rgba(165, 182, 200, 0.2) 0%, rgba(12, 16, 22, 0.52) 100%)',
                  opacity: mistOpacity,
                }}
              />
            );
          }

          if (item.visualType === 'empty_sky_drift') {
            const skySweep = interpolate(f, [0, 34], [0, 0.25], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`vis-${idx}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '58%',
                  background:
                    'linear-gradient(180deg, rgba(190, 208, 224, 0.24) 0%, rgba(190, 208, 224, 0) 100%)',
                  opacity: skySweep,
                }}
              />
            );
          }

          if (item.visualType === 'silence_vignette') {
            const dark = interpolate(f, [0, 25], [0, 0.42], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`vis-${idx}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  boxShadow: `inset 0 0 240px rgba(0, 0, 0, ${0.38 + dark})`,
                }}
              />
            );
          }
        }

        return null;
      })}
    </div>
  );
};
