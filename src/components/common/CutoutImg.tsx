import React, { useId } from 'react';
import { Img } from 'remotion';
import {
  resolveAssetStaticPath,
  getAssetEntry,
  hasWhiteBackgroundCutout,
} from '../../utils/assetResolver';
import {
  ARCHIVAL_COLD_GRADE_FILTER,
  BW_HALFTONE_FILTER,
  CONTACT_SHADOW_MASK_STYLE,
} from '../../utils/colorGrading';

export interface CutoutImgProps {
  assetId: string;
  requiresBackgroundRemoval?: boolean;
  colorTreatment?: string;
  featherBottom?: boolean;
  extraFilter?: string;
  objectFit?: 'contain' | 'cover';
  noArchivalBorder?: boolean;
  style?: React.CSSProperties;
}

export const CutoutImg: React.FC<CutoutImgProps> = ({
  assetId,
  requiresBackgroundRemoval,
  colorTreatment,
  featherBottom = false,
  extraFilter,
  objectFit = 'contain',
  noArchivalBorder = false,
  style,
}) => {
  const uid = useId().replace(/:/g, '_');
  const entry = getAssetEntry(assetId);
  // Only apply white-to-alpha keying when the resolved file actually has a solid #FFFFFF cutout background
  const isTrueWhiteCutout = hasWhiteBackgroundCutout(assetId);
  const needsAlpha =
    isTrueWhiteCutout &&
    (requiresBackgroundRemoval ?? entry?.requiresBackgroundRemoval ?? true);
  const treatment = colorTreatment ?? entry?.colorTreatment;

  const filterId = `white-to-alpha-${uid}`;

  const filters: string[] = [];
  if (needsAlpha) {
    filters.push(`url(#${filterId})`);
  }
  if (treatment === 'bw_halftone_cutout') {
    filters.push(BW_HALFTONE_FILTER);
  } else if (!isTrueWhiteCutout) {
    filters.push(ARCHIVAL_COLD_GRADE_FILTER);
  }
  if (extraFilter) {
    filters.push(extraFilter);
  }

  const dropShadow =
    treatment === 'bw_halftone_cutout'
      ? 'drop-shadow(0 14px 24px rgba(0,0,0,0.28))'
      : needsAlpha
      ? 'drop-shadow(0 18px 28px rgba(0,0,0,0.55))'
      : undefined;

  if (dropShadow && !extraFilter?.includes('drop-shadow')) {
    filters.push(dropShadow);
  }

  // Real archival photos mounted as midground subjects get an authentic museum border
  const isMountedArchivalSubject =
    !isTrueWhiteCutout && objectFit === 'contain' && !noArchivalBorder;

  const combinedStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: !isTrueWhiteCutout && objectFit === 'contain' ? 'cover' : objectFit,
    display: 'block',
    ...(filters.length > 0 ? { filter: filters.join(' ') } : {}),
    ...(featherBottom && isTrueWhiteCutout ? CONTACT_SHADOW_MASK_STYLE : {}),
    ...(isMountedArchivalSubject
      ? {
          border: '10px solid #f6f4ee',
          boxShadow: '0 24px 52px rgba(0, 0, 0, 0.78)',
        }
      : {}),
    ...style,
  };

  return (
    <>
      {needsAlpha && (
        <svg
          width="0"
          height="0"
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -4 -4 -4 11.5 0"
              />
            </filter>
          </defs>
        </svg>
      )}
      <Img src={resolveAssetStaticPath(assetId)} style={combinedStyle} />
    </>
  );
};
