export interface AssetManifestEntry {
  assetId: string;
  fileName: string;
  assetOrigin: 'ai_generated' | 'real_archival';
  assetType: 'cutout_png' | 'full_bleed_image' | 'alpha_frame_portal_png';
  zLayerRole: string;
  requiresBackgroundRemoval: boolean;
  aspectRatio: string;
  aiImagePrompt?: string;
  searchQuery?: string;
  fallbackSearchQuery?: string;
  wikipediaPageTitle?: string;
  archiveSource?: string;
  attribution?: string;
  reusedFrom: string | null;
  colorTreatment?: string;
}

export interface MicroAction {
  triggerWord: string;
  triggerFrame: number;
  type: string;
  badgeText?: string;
  text?: string;
  stampText?: string;
  targetText?: string;
  value?: string;
}

export interface ParallaxLayer {
  layerRole: 'background_plate' | 'midground_hero_cutout' | 'foreground_flank_silhouette';
  assetId: string;
  zIndex: number;
  mountFrame: number;
  triggerWord?: string;
  triggerFrame?: number;
  keepMountedInWorld?: boolean;
  weatherEffect?: 'snow_mist' | 'snow' | 'embers' | 'dust' | 'fog_mist';
  position?: {
    bottomOffsetPx?: number;
    horizontalAlign?: 'left' | 'center' | 'right';
  };
  framing?: string;
  lensOcclusion?: {
    scale?: number;
    filter?: string;
  };
}

export interface RigNode {
  nodeIndex: number;
  nodeRole: string;
  assetId: string;
  startFrame: number;
  endFrame: number;
  persistent?: boolean;
  triggerWord?: string;
  triggerFrame?: number;
}

export interface MontageItem {
  itemIndex: number;
  assetId: string;
  aspectRatio: string;
  triggerWord: string;
  triggerFrame: number;
  mountFrame: number;
  position: {
    slot: 'far_left' | 'left' | 'center' | 'right' | 'far_right';
    tiltDeg: number;
  };
  entry: string;
}

export interface StoryboardScene {
  sceneId: string;
  stageType:
    | 'STAGE_1_FULL_BLEED_VINTAGE'
    | 'STAGE_2_ARCHIVAL_BOARD'
    | 'STAGE_3_CANVAS_MONTAGE'
    | 'STAGE_4_PARALLAX_CUTOUT';
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  spokenLine: string;
  transitionIn?: string;
  // Stage 1
  assetId?: string;
  aspectRatio?: string;
  treatment?: {
    filmGrain?: string;
    liftedDarks?: boolean;
    cameraDrift?: {
      startScale: number;
      endScale: number;
      curve: string;
    };
  };
  // Stage 2
  mountedCardAssetId?: string;
  board?: {
    border: string;
    surface: 'dark_wood' | 'slate' | string;
    dropShadow: string;
    tiltDeg: number;
    attributionStamp?: string;
  };
  inspectionZoom?: {
    triggerWord: string;
    triggerFrame: number;
    scale: number;
  };
  // Stage 3
  montage?: {
    canvasColor: string;
    keepPreviousItemsVisible: boolean;
    items: MontageItem[];
  };
  // Stage 4
  parallaxVariant?:
    | 'STANDARD_2_5D_PARALLAX'
    | 'MULTI_NODE_3D_AUDITORIUM_RIG'
    | 'MIRROR_PORTAL_HUD_ROOM'
    | 'BRUSH_TITLE_TO_NEWSPAPER_CUTOUT';
  bgAssetId?: string;
  heroCutoutAssetId?: string;
  propCutoutAssetId?: string;
  foregroundSilhouetteAssetId?: string;
  weatherPass?: 'snow' | 'embers' | 'dust' | 'fog_mist';
  cameraPush?: {
    startScale: number;
    endScale: number;
    curve: string;
  };
  layers?: ParallaxLayer[];
  brushBanner?: {
    text: string;
    color: string;
    triggerWord: string;
    triggerFrame: number;
  };
  newspaperUnfold?: {
    assetId: string;
    triggerWord: string;
    triggerFrame: number;
    unfold: string;
  };
  heroSpring?: {
    assetId: string;
    triggerWord: string;
    triggerFrame: number;
    framing: string;
    origin: string;
  };
  mirrorPortal?: {
    frame: string;
    reflectionAssetId: string;
    triggerWord: string;
    triggerFrame: number;
  };
  hudTelemetry?: Array<{
    text: string;
    triggerWord: string;
    triggerFrame: number;
  }>;
  rigNodes?: RigNode[];
  keepPreviousNodesMounted?: boolean;
  microActions?: MicroAction[];
}

export interface StoryboardData {
  projectMeta: {
    title: string;
    fps: number;
    width: number;
    height: number;
    durationInFrames: number;
    hookEndFrame: number;
    hookBoundaryReason?: string;
    continuityNote?: string;
    voiceoverAudioPath?: string;
  };
  assetManifest: AssetManifestEntry[];
  scenes: StoryboardScene[];
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  probability: number;
}

export interface TranscriptSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export interface TranscriptData {
  language: string;
  duration: number;
  text: string;
  segments: TranscriptSegment[];
}
